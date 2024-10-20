import { Types } from 'mongoose';
import {
	BankVerificationFormDB,
	BusinessVerificationFormDB,
	EmploymentVerificationFormDB,
	IAccount,
	IBankVerificationForm,
	IBusinessVerificationForm,
	IEmploymentVerificationForm,
	IIncomeTaxVerificationForm,
	IncomeVerificationFormDB,
	IResidenceVerificationForm,
	ITaskManager,
	ITeleVerificationForm,
	IVerificationForm,
	ResidenceVerificationFormDB,
	TaskDB,
	TaskManagerDB,
	TeleVerificationFormDB,
	VerificationFormDB,
} from '../../../mongo';
import { TaskStatus, UserLevel } from '../../config/const';
import { CustomError, ERRORS } from '../../errors';
import { IDType } from '../../types';
import DateUtils from '../../utils/DateUtils';
import { filterUndefinedKeys } from '../../utils/ExpressUtils';
import AccountService from '../auth/account';

export default class TaskService {
	private _account: AccountService;

	public constructor(account: AccountService) {
		this._account = account;
	}

	public async createTask(details: {
		assignedTo: Types.ObjectId;
		dueDate: Date;
		priority: 'low' | 'medium' | 'high';
		title: string;
		description?: string;
		applicantName: string;
		verificationType: 'business' | 'non-business' | 'nri';
	}) {
		if (this._account.userLevel < UserLevel.Admin) {
			throw new CustomError(ERRORS.PERMISSION_DENIED);
		}

		const task = await TaskDB.create({ ...details, kyc1: details.assignedTo });
		await TaskManagerDB.create({
			taskId: task._id,
			assignedBy: this._account.userId,
			assignedTo: details.assignedTo,
		});

		return task._id;
	}

	public async getNavigationLink(task_id: Types.ObjectId) {
		const form = await VerificationFormDB.findOne({ task_id });
		if (form && form.residence) {
			return `http://maps.google.com/?q=${encodeURIComponent(form.residence)}`;
		}
		return null;
	}

	public async updateTask(
		taskId: Types.ObjectId,
		data: Partial<{
			dueDate: Date;
			priority: 'low' | 'medium' | 'high';
			title: string;
			description?: string;
		}>
	) {
		const taskData = filterUndefinedKeys(data);
		const updated = await TaskDB.updateOne({ _id: taskId }, taskData);
		return updated.modifiedCount > 0;
	}

	public async updateTaskStatus(taskId: Types.ObjectId, status: TaskStatus) {
		let managedByMe;
		if (this._account.userLevel < UserLevel.Admin) {
			managedByMe = await TaskManagerDB.findOne({
				taskId,
				assignedTo: this._account.userId,
			});
		} else {
			managedByMe = await TaskManagerDB.findOne({
				taskId,
				assignedBy: this._account.userId,
			});
		}
		if (!managedByMe) {
			throw new CustomError(ERRORS.NOT_FOUND);
		}

		const task = await TaskDB.updateOne(
			{
				_id: taskId,
			},
			{
				status: status,
			}
		);

		if (task.modifiedCount <= 0) {
			throw new CustomError(ERRORS.NOT_FOUND);
		}
	}

	public async updateVerificationForm(
		taskId: Types.ObjectId,
		verificationForm: Partial<IVerificationForm>
	) {
		const { task_id: _, ...data } = verificationForm;
		const verificationFormData = filterUndefinedKeys(data);
		const updated = await VerificationFormDB.updateOne({ task_id: taskId }, verificationFormData);
		if (updated.modifiedCount === 0) {
			throw new CustomError(ERRORS.NOT_FOUND);
		}
	}

	public async updateResidenceVerificationForm(
		taskId: Types.ObjectId,
		verificationForm: Partial<IResidenceVerificationForm>
	) {
		const { task_id: _, ...data } = verificationForm;
		const verificationFormData = filterUndefinedKeys(data);
		const updated = await ResidenceVerificationFormDB.updateOne(
			{ task_id: taskId },
			verificationFormData
		);
		if (updated.modifiedCount === 0) {
			throw new CustomError(ERRORS.NOT_FOUND);
		}
	}

	public async updateTeleVerificationForm(
		taskId: Types.ObjectId,
		verificationForm: Partial<ITeleVerificationForm>
	) {
		const { task_id: _, ...data } = verificationForm;
		const verificationFormData = filterUndefinedKeys(data);
		const updated = await TeleVerificationFormDB.updateOne(
			{ task_id: taskId },
			verificationFormData
		);
		if (updated.modifiedCount === 0) {
			throw new CustomError(ERRORS.NOT_FOUND);
		}
	}

	public async updateBusinessVerificationForm(
		taskId: Types.ObjectId,
		verificationForm: Partial<IBusinessVerificationForm>
	) {
		const { task_id: _, ...data } = verificationForm;
		const verificationFormData = filterUndefinedKeys(data);
		const updated = await BusinessVerificationFormDB.updateOne(
			{ task_id: taskId },
			verificationFormData
		);
		if (updated.modifiedCount === 0) {
			throw new CustomError(ERRORS.NOT_FOUND);
		}
	}

	public async updateEmploymentVerificationForm(
		taskId: Types.ObjectId,
		verificationForm: Partial<IEmploymentVerificationForm>
	) {
		const { task_id: _, ...data } = verificationForm;
		const verificationFormData = filterUndefinedKeys(data);
		const updated = await EmploymentVerificationFormDB.updateOne(
			{ task_id: taskId },
			verificationFormData
		);
		if (updated.modifiedCount === 0) {
			throw new CustomError(ERRORS.NOT_FOUND);
		}
	}

	public async updateBankVerificationForm(
		taskId: Types.ObjectId,
		verificationForm: Partial<IBankVerificationForm>
	) {
		const { task_id: _, ...data } = verificationForm;
		const verificationFormData = filterUndefinedKeys(data);
		const updated = await BankVerificationFormDB.updateOne(
			{ task_id: taskId },
			verificationFormData
		);
		if (updated.modifiedCount === 0) {
			throw new CustomError(ERRORS.NOT_FOUND);
		}
	}

	public async updateIncomeTaxVerificationForm(
		taskId: Types.ObjectId,
		verificationForm: Partial<IIncomeTaxVerificationForm>
	) {
		const { task_id: _, ...data } = verificationForm;
		const verificationFormData = filterUndefinedKeys(data);
		const updated = await IncomeVerificationFormDB.updateOne(
			{ task_id: taskId },
			verificationFormData
		);
		if (updated.modifiedCount === 0) {
			throw new CustomError(ERRORS.NOT_FOUND);
		}
	}

	public async fetchFormData(
		taskId: Types.ObjectId,
		type: 'bank' | 'business' | 'employment' | 'income' | 'residence' | 'tele' | 'verification'
	) {
		const task = await TaskDB.findById(taskId);
		if (!task) {
			throw new CustomError(ERRORS.NOT_FOUND);
		}
		let form;
		switch (type) {
			case 'verification':
				form = await VerificationFormDB.findOne({ task_id: taskId });
				break;
			case 'bank':
				form = await BankVerificationFormDB.findOne({ task_id: taskId });
				break;
			case 'business':
				form = await BusinessVerificationFormDB.findOne({ task_id: taskId });
				break;
			case 'employment':
				form = await EmploymentVerificationFormDB.findOne({ task_id: taskId });
				break;
			case 'income':
				form = await IncomeVerificationFormDB.findOne({ task_id: taskId });
				break;
			case 'residence':
				form = await ResidenceVerificationFormDB.findOne({ task_id: taskId });
				break;
			case 'tele':
				form = await TeleVerificationFormDB.findOne({ task_id: taskId });
				break;
			default:
				throw new CustomError(ERRORS.INVALID_FIELDS);
		}
		if (!form) {
			throw new CustomError(ERRORS.NOT_FOUND);
		}

		const { _id, __v, task_id, ...formData } = form.toObject();

		return formData;
	}

	public async getTask(taskId: Types.ObjectId) {
		const managedByMe = await TaskManagerDB.findOne({
			$or: [{ assignedBy: this._account.userId }, { assignedTo: this._account.userId }],
			taskId,
		});

		if (!managedByMe) {
			throw new CustomError(ERRORS.PERMISSION_DENIED);
		}

		const task = await TaskDB.findOne({
			_id: taskId,
		}).populate<{
			verificationFormId: IVerificationForm;
			teleVerificationId: ITeleVerificationForm;
			residenceVerificationId: IResidenceVerificationForm;
			incomeVerificationId: IIncomeTaxVerificationForm;
			bankVerificationId: IBankVerificationForm;
			employmentVerificationId: IEmploymentVerificationForm;
			businessVerificationId: IBusinessVerificationForm;
		}>(
			'verificationFormId teleVerificationId residenceVerificationId incomeVerificationId bankVerificationId employmentVerificationId businessVerificationId'
		);

		if (!task) {
			throw new CustomError(ERRORS.NOT_FOUND);
		}

		return {
			...processDocs(task),
			attachments: task.attachments,
		};
	}

	public async assignTask(
		taskId: Types.ObjectId,
		assignTo: Types.ObjectId,
		opts: { reKyc?: boolean } = {}
	) {
		let managedByMe;
		if (this._account.userLevel < UserLevel.Admin) {
			managedByMe = await TaskManagerDB.findOne({
				taskId,
				assignedTo: this._account.userId,
			});
		} else {
			managedByMe = await TaskManagerDB.findOne({
				taskId,
				assignedBy: this._account.userId,
			});
		}
		if (!managedByMe) {
			throw new CustomError(ERRORS.NOT_FOUND);
		}

		await TaskManagerDB.create({
			taskId,
			assignedBy: this._account.userId,
			assignedTo: assignTo,
			level: managedByMe.level + 1,
		});

		if (opts.reKyc) {
			const task = await TaskDB.findById(taskId);
			if (!task) {
				throw new CustomError(ERRORS.NOT_FOUND);
			} else if (!task.kyc1) {
				task.kyc1 = assignTo;
			} else if (!task.kyc2) {
				task.kyc2 = assignTo;
			} else if (!task.kyc3) {
				task.kyc3 = assignTo;
			} else if (!task.kyc4) {
				task.kyc4 = assignTo;
			} else if (!task.kyc5) {
				task.kyc5 = assignTo;
			} else {
				throw new CustomError(ERRORS.INVALID_FIELDS);
			}
		}
	}

	public async transferTask(taskId: Types.ObjectId, assignTo: Types.ObjectId) {
		let managedByMe;
		if (this._account.userLevel < UserLevel.Admin) {
			managedByMe = await TaskManagerDB.findOne({
				taskId,
				assignedTo: this._account.userId,
			});
		} else {
			managedByMe = await TaskManagerDB.findOne({
				taskId,
				assignedBy: this._account.userId,
			});
		}
		if (!managedByMe) {
			throw new CustomError(ERRORS.NOT_FOUND);
		}

		await TaskManagerDB.deleteMany({
			taskId,
			level: { $gt: managedByMe.level },
		});

		await TaskManagerDB.create({
			taskId,
			assignedBy: this._account.userId,
			assignedTo: assignTo,
			level: managedByMe.level + 1,
		});
	}

	public async uploadAttachment(taskId: Types.ObjectId, attachment: string) {
		await TaskDB.updateOne(
			{
				_id: taskId,
			},
			{
				$addToSet: {
					attachments: attachment,
				},
			}
		);
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

	public async deleteAttachment(taskId: Types.ObjectId, attachment: string) {
		await TaskDB.updateOne(
			{
				_id: taskId,
			},
			{
				$pull: {
					attachments: attachment,
				},
			}
		);
	}

	public static async assignedBy(
		agentId: Types.ObjectId,
		query: Partial<{
			date_range?: {
				start: Date;
				end: Date;
			};
			priority: 'low' | 'medium' | 'high';
			status: TaskStatus;
		}> = {}
	) {
		const managedTasks = await TaskManagerDB.find({ assignedBy: agentId }).populate<{
			assignedTo: IAccount;
		}>('assignedTo');

		const taskIds = managedTasks.reduce((acc, task) => {
			acc[task.taskId._id.toString()] = task.assignedTo.name;
			return acc;
		}, {} as Record<string, string>);

		const records = await TaskDB.find({
			_id: { $in: Object.keys(taskIds).map((id) => new Types.ObjectId(id)) },
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
			const assignedTo = taskIds[record._id.toString()];
			return {
				...processDocs(record),
				assignedTo: assignedTo,
			};
		});
	}

	public static async assignedTo(
		agentId: Types.ObjectId,
		query: Partial<{
			date_range?: {
				start: Date;
				end: Date;
			};
			priority: 'low' | 'medium' | 'high';
			status: TaskStatus;
		}> = {}
	) {
		const managedTasks = await TaskManagerDB.find({ assignedTo: agentId }).populate<{
			assignedBy: IAccount;
		}>('assignedBy');

		const taskIds = managedTasks.reduce((acc, task) => {
			acc[task.taskId._id.toString()] = task.assignedBy.name;
			return acc;
		}, {} as Record<string, string>);

		const records = await TaskDB.find({
			_id: { $in: Object.keys(taskIds).map((id) => new Types.ObjectId(id)) },
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
			const assignedBy = taskIds[record._id.toString()];
			return {
				...processDocs(record),
				assignedBy: assignedBy,
			};
		});
	}
}

function processDocs(doc: any): {
	id: IDType;
	title: string;
	description?: string;
	priority: 'low' | 'medium' | 'high';
	verificationType: 'business' | 'non-business' | 'nri';
	dueDate: string;
	relativeDate: string;
	createdAt: string;
	status: string;
	isOverdue: boolean;
	applicationNo: string;
	applicantName: string;
	kycCount: number;
	kycStatus: {
		teleVerification: string;
		residenceVerification: string;
		incomeVerification: string;
		bankVerification: string;
		employmentVerification: string;
		businessVerification: string;
	};
} {
	return {
		id: doc._id as IDType,
		title: doc.title as string,
		description: doc.description as string,
		priority: doc.priority as 'low' | 'medium' | 'high',
		verificationType: doc.verificationType as 'business' | 'non-business' | 'nri',
		createdAt: DateUtils.getMoment(doc.createdAt).format('MMM Do, YYYY hh:mm A'),
		dueDate: DateUtils.getMoment(doc.dueDate).format('MMM Do, YYYY hh:mm A'),
		relativeDate: DateUtils.getMoment(doc.dueDate).fromNow(),
		status: doc.status,
		applicationNo: doc.applicationNo,
		applicantName: doc.applicantName,
		isOverdue:
			doc.status === 'completed'
				? DateUtils.getMoment(doc.dueDate).isBefore(doc.completedAt)
				: DateUtils.getMoment(doc.dueDate).isBefore(DateUtils.getMomentNow()),
		kycCount: [doc.kyc1, doc.kyc2, doc.kyc3, doc.kyc4, doc.kyc5].filter((kyc) => !!kyc).length,
		kycStatus: {
			teleVerification: doc.teleVerificationId
				? doc.teleVerificationId.verificationResult ?? 'N/A'
				: undefined,
			residenceVerification: doc.residenceVerificationId
				? doc.residenceVerificationId.remarks ?? 'N/A'
				: undefined,
			incomeVerification: doc.incomeVerificationId
				? doc.incomeVerificationId.remarks ?? 'N/A'
				: undefined,
			bankVerification: doc.bankVerificationId
				? doc.bankVerificationId.remarks ?? 'N/A'
				: undefined,
			employmentVerification: doc.employmentVerificationId
				? doc.employmentVerificationId.officeRemarks ?? 'N/A'
				: undefined,
			businessVerification: doc.businessVerificationId
				? doc.businessVerificationId.recommended ?? 'N/A'
				: undefined,
		},
	};
}
