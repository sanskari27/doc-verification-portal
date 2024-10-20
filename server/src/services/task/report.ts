import {
	IBankVerificationForm,
	IBusinessVerificationForm,
	IEmploymentVerificationForm,
	IIncomeTaxVerificationForm,
	IResidenceVerificationForm,
	ITaskManager,
	ITeleVerificationForm,
	IVerificationForm,
	TaskDB,
	TaskManagerDB,
} from '../../../mongo';
import { TaskStatus, UserLevel } from '../../config/const';
import { CustomError, ERRORS } from '../../errors';
import DateUtils from '../../utils/DateUtils';
import AccountService from '../auth/account';

export default class ReportService {
	private _account: AccountService;

	public constructor(account: AccountService) {
		this._account = account;
	}

	public async generateReport(
		query: Partial<{
			date_range?: {
				start: Date;
				end: Date;
			};
			priority: 'low' | 'medium' | 'high';
			status: TaskStatus;
			masterAccess: boolean;
		}> = {}
	): Promise<
		{
			applicationNo: string;
			city: string;
			receivedDate: string;
			agentName: string;
			applicantName: string;
			coApplicantName: string;
			phoneNumbers: string;
			dob: string;
			verificationType: string;
			businessName: string;
			posted: string;
			bankName: string;
			address: string;
		}[]
	> {
		if (this._account.userLevel < UserLevel.Admin) {
			throw new CustomError(ERRORS.PERMISSION_DENIED);
		}
		let managedTasks: ITaskManager[] = [];
		if (!query.masterAccess) {
			managedTasks = await TaskManagerDB.find({ assignedBy: this._account.userId });
		}

		const records = await TaskDB.find({
			$and: [
				{
					...(query.date_range && {
						dueDate: {
							$gte: query.date_range.start,
							$lte: query.date_range.end,
						},
					}),
				},
				{ ...(query.priority && { priority: query.priority }) },
				{ ...(query.status && { status: query.status }) },
				{ ...(!query.masterAccess && { _id: { $in: managedTasks.map((task) => task.taskId) } }) },
			],
		})
			.populate<{
				verificationFormId: IVerificationForm;
				teleVerificationId: ITeleVerificationForm;
				residenceVerificationId: IResidenceVerificationForm;
				incomeVerificationId: IIncomeTaxVerificationForm;
				bankVerificationId: IBankVerificationForm;
				employmentVerificationId: IEmploymentVerificationForm;
				businessVerificationId: IBusinessVerificationForm;
			}>(
				'verificationFormId teleVerificationId residenceVerificationId incomeVerificationId bankVerificationId employmentVerificationId businessVerificationId'
			)
			.sort({ dueDate: 1 });

		return records.map((record) => {
			if (record.verificationFormId === null) {
				console.log(record._id);
				return {} as any;
			}

			return {
				uniqueId: record._id,
				applicationNo: record.applicationNo || 'N/A',
				city: record.verificationFormId?.city || 'N/A',
				receivedDate: record.verificationFormId?.dateOfApplication
					? DateUtils.getMoment(record.verificationFormId.dateOfApplication).format('DD/MM/YYYY')
					: 'N/A',
				applicantName: record.verificationFormId?.applicantName || 'N/A',
				coApplicantName: record.verificationFormId?.coApplicantName || 'N/A',
				phoneNumbers: record.verificationFormId?.telephone || 'N/A',
				dob: record.verificationFormId?.applicantDOB
					? DateUtils.getMoment(record.verificationFormId.applicantDOB).format('DD/MM/YYYY')
					: 'N/A',
				verificationType:
					record.verificationType === 'business'
						? 'Business'
						: record.verificationType === 'non-business'
						? 'Service'
						: 'Pensioner',

				businessName:
					record.verificationType === 'nri'
						? 'Pensioner'
						: record.verificationType === 'business'
						? `${record.businessVerificationId?.businessDetails?.companyName || 'N/A'} / ${
								record.businessVerificationId?.businessDetails?.designation || 'N/A'
						  }`
						: `${record.employmentVerificationId?.employmentDetails?.organizationName || 'N/A'} / ${
								record.employmentVerificationId?.designation || 'N/A'
						  }`,

				posted:
					record.verificationType === 'nri'
						? 'Pensioner'
						: record.verificationType === 'business'
						? record.businessVerificationId?.officeAddress || 'N/A'
						: record.employmentVerificationId?.officeAddress || 'N/A',

				bankName: record.bankVerificationId?.applicant?.bankName || 'N/A',
				address: record.verificationFormId?.residence || 'N/A',
				status: {
					teleVerification: record.teleVerificationId
						? record.teleVerificationId.verificationResult ?? 'N/A'
						: undefined,
					residenceVerification: record.residenceVerificationId
						? record.residenceVerificationId.remarks ?? 'N/A'
						: undefined,
					incomeVerification: record.incomeVerificationId
						? record.incomeVerificationId.remarks ?? 'N/A'
						: undefined,
					bankVerification: record.bankVerificationId
						? record.bankVerificationId.remarks ?? 'N/A'
						: undefined,
					employmentVerification: record.employmentVerificationId
						? record.employmentVerificationId.officeRemarks ?? 'N/A'
						: undefined,
					businessVerification: record.businessVerificationId
						? record.businessVerificationId.recommended ?? 'N/A'
						: undefined,
				},
			};
		});
	}

	public async previousRecordsSummary(
		query: Partial<{ limit: number; masterAccess: boolean }> = {}
	) {
		let managedTasks: ITaskManager[] = [];
		if (!query.masterAccess) {
			managedTasks = await TaskManagerDB.find({ assignedBy: this._account.userId });
		}

		const records = await TaskDB.find({
			$and: [
				{ ...(!query.masterAccess && { _id: { $in: managedTasks.map((task) => task.taskId) } }) },
			],
		})
			.sort({ dueDate: -1 })
			.limit(query.limit || 5);

		return records.map((record) => {
			return {
				name: record.applicantName,
				status: record.status.toLowerCase(),
				dueDate: DateUtils.getMoment(record.dueDate).format('DD MMM YYYY'),
				verificationType: record.verificationType,
			};
		});
	}

	public async cityBasedSummary(query: Partial<{ limit: number; masterAccess: boolean }> = {}) {
		let managedTasks: ITaskManager[] = [];
		if (!query.masterAccess) {
			managedTasks = await TaskManagerDB.find({ assignedBy: this._account.userId });
		}

		const records = await TaskDB.aggregate([
			{
				$match: {
					...(!query.masterAccess && { _id: { $in: managedTasks.map((task) => task.taskId) } }),
				},
			},
			{
				$group: {
					_id: '$city',
					docs: { $push: '$$ROOT' },
				},
			},
			{
				$sort: { _id: 1 },
			},
		]);

		return records
			.map((record) => {
				const verified = record.docs.filter(
					(doc: any) => doc.status === TaskStatus.Completed
				).length;
				return {
					city: record._id,
					verified,
					total: record.docs.length,
					verifiedPercentage: ((verified / record.docs.length) * 100).toFixed(2),
				};
			})
			.slice(0, query.limit || 5);
	}

	public async monthlyReport(query: Partial<{ year: number; masterAccess: boolean }> = {}) {
		let managedTasks: ITaskManager[] = [];
		if (!query.masterAccess) {
			managedTasks = await TaskManagerDB.find({ assignedBy: this._account.userId });
		}

		const records = await TaskDB.aggregate([
			{
				$match: {
					...(!query.masterAccess && { _id: { $in: managedTasks.map((task) => task.taskId) } }),
					status: TaskStatus.Completed,
				},
			},
			{
				$group: {
					_id: { $month: '$dueDate' },
					count: { $sum: 1 },
				},
			},
			{
				$sort: { _id: 1 },
			},
		]);

		return records.map((record) => {
			return {
				month: DateUtils.getMonthName(record._id - 1),
				count: record.count,
			};
		});
	}

	public async monthReport(
		query: Partial<{ month: number; year: number; masterAccess: boolean }> = {}
	) {
		let managedTasks: ITaskManager[] = [];
		if (!query.masterAccess) {
			managedTasks = await TaskManagerDB.find({ assignedBy: this._account.userId });
		}

		const date = new Date(
			query.year || new Date().getFullYear(),
			query.month || new Date().getMonth()
		);

		const records = await TaskDB.find({
			$and: [
				{
					dueDate: {
						$gte: new Date(date.getFullYear(), date.getMonth() - 1, 1),
						$lt: new Date(date.getFullYear(), date.getMonth(), 1),
					},
					...(!query.masterAccess && { _id: { $in: managedTasks.map((task) => task.taskId) } }),
				},
			],
		});

		const recordsGrouped = records.reduce((rec, record) => {
			rec[record.status] = rec[record.status] ? rec[record.status] + 1 : 1;
			return rec;
		}, {} as { [key: string]: number });

		return Object.keys(recordsGrouped).map((key) => {
			return {
				status: key,
				count: recordsGrouped[key],
			};
		});
	}

	public async summary(query: Partial<{ masterAccess: boolean }> = {}) {
		let managedTasks: ITaskManager[] = [];
		if (!query.masterAccess) {
			managedTasks = await TaskManagerDB.find({ assignedBy: this._account.userId });
		}

		const records = await TaskDB.aggregate([
			{
				$match: {
					...(!query.masterAccess && { _id: { $in: managedTasks.map((task) => task.taskId) } }),
				},
			},
			{
				$group: {
					_id: '$status',
					count: { $sum: 1 },
				},
			},
		]);

		return records.reduce(
			(acc, record) => {
				acc.total += record.count;
				if (record._id === TaskStatus.Completed) {
					acc.verified = record.count;
				} else if (record._id === TaskStatus.Pending) {
					acc.notStarted = record.count;
				} else if (record._id === TaskStatus.RejectedUnderReview) {
					acc.reKYCRequired = record.count;
				}
				return acc;
			},
			{
				total: 0,
				verified: 0,
				notStarted: 0,
				reKYCRequired: 0,
			}
		) as {
			total: number;
			verified: number;
			notStarted: number;
			reKYCRequired: number;
		};
	}
}
