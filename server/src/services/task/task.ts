import { Types } from 'mongoose';
import {
	AccountDB,
	BankVerificationFormDB,
	BusinessVerificationFormDB,
	EmploymentVerificationFormDB,
	IncomeVerificationFormDB,
	ResidenceVerificationFormDB,
	TaskDB,
	TeleVerificationFormDB,
} from '../../../mongo';
import VerificationForm from '../../../mongo/repo/VerificationForm';
import { IVerificationForm } from '../../../mongo/types/verificationForm';
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

		const task = await TaskDB.create({
			...details,
			assignedBy: this._account.userId,
			agentsInvolved: [this._account.userId, details.assignedTo],
		});

		return task._id;
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

	public async updateVerificationForm(
		taskId: Types.ObjectId,
		verificationForm: Partial<IVerificationForm>
	) {
		const { task_id: _, ...data } = verificationForm;
		const verificationFormData = filterUndefinedKeys(data);
		const updated = await VerificationForm.updateOne({ task_id: taskId }, verificationFormData);
		return updated.modifiedCount > 0;
	}

	public async updateResidenceVerificationForm(
		taskId: Types.ObjectId,
		verificationForm: Partial<IVerificationForm>
	) {
		const { task_id: _, ...data } = verificationForm;
		const verificationFormData = filterUndefinedKeys(data);
		const updated = await ResidenceVerificationFormDB.updateOne(
			{ task_id: taskId },
			verificationFormData
		);
		return updated.modifiedCount > 0;
	}

	public async updateTeleVerificationForm(
		taskId: Types.ObjectId,
		verificationForm: Partial<IVerificationForm>
	) {
		const { task_id: _, ...data } = verificationForm;
		const verificationFormData = filterUndefinedKeys(data);
		const updated = await TeleVerificationFormDB.updateOne(
			{ task_id: taskId },
			verificationFormData
		);
		return updated.modifiedCount > 0;
	}

	public async updateBusinessVerificationForm(
		taskId: Types.ObjectId,
		verificationForm: Partial<IVerificationForm>
	) {
		const { task_id: _, ...data } = verificationForm;
		const verificationFormData = filterUndefinedKeys(data);
		const updated = await BusinessVerificationFormDB.updateOne(
			{ task_id: taskId },
			verificationFormData
		);
		return updated.modifiedCount > 0;
	}

	public async updateEmploymentVerificationForm(
		taskId: Types.ObjectId,
		verificationForm: Partial<IVerificationForm>
	) {
		const { task_id: _, ...data } = verificationForm;
		const verificationFormData = filterUndefinedKeys(data);
		const updated = await EmploymentVerificationFormDB.updateOne(
			{ task_id: taskId },
			verificationFormData
		);
		return updated.modifiedCount > 0;
	}

	public async updateBankVerificationForm(
		taskId: Types.ObjectId,
		verificationForm: Partial<IVerificationForm>
	) {
		const { task_id: _, ...data } = verificationForm;
		const verificationFormData = filterUndefinedKeys(data);
		const updated = await BankVerificationFormDB.updateOne(
			{ task_id: taskId },
			verificationFormData
		);
		return updated.modifiedCount > 0;
	}

	public async updateIncomeTaxVerificationForm(
		taskId: Types.ObjectId,
		verificationForm: Partial<IVerificationForm>
	) {
		const { task_id: _, ...data } = verificationForm;
		const verificationFormData = filterUndefinedKeys(data);
		const updated = await IncomeVerificationFormDB.updateOne(
			{ task_id: taskId },
			verificationFormData
		);
		return updated.modifiedCount > 0;
	}

	public async getTask(taskId: Types.ObjectId) {
		const task = await TaskDB.findOne({
			_id: taskId,
			agentsInvolved: this._account.userId,
		});

		if (!task) {
			throw new CustomError(ERRORS.NOT_FOUND);
		}

		return {
			assignedBy: task.assignedBy,
			agentsInvolved: task.agentsInvolved,
			assignedTo: task.assignedTo,
			dueDate: task.dueDate,
			completedAt: task.completedAt,
			status: task.status,
			priority: task.priority,
			title: task.title,
			description: task.description,

			verificationType: task.verificationType,
			applicantName: task.applicantName,
			verificationFormId: task.verificationFormId,
			teleVerificationId: task.teleVerificationId,
			residenceVerificationId: task.residenceVerificationId,
			incomeVerificationId: task.incomeVerificationId,
			bankVerificationId: task.bankVerificationId,
			employmentVerificationId: task.employmentVerificationId,
			businessVerificationId: task.businessVerificationId,
		};
	}

	public async getVerificationForm(
		type: 'bank' | 'business' | 'employment' | 'income' | 'residence' | 'tele',
		formID: Types.ObjectId
	) {
		let verificationForm;

		switch (type) {
			case 'bank':
				verificationForm = await BankVerificationFormDB.findById(formID);
				break;
			case 'business':
				verificationForm = await BusinessVerificationFormDB.findById(formID);
				break;
			case 'employment':
				verificationForm = await EmploymentVerificationFormDB.findById(formID);
				break;
			case 'income':
				verificationForm = await IncomeVerificationFormDB.findById(formID);
				break;
			case 'residence':
				verificationForm = await ResidenceVerificationFormDB.findById(formID);
				break;
			case 'tele':
				verificationForm = await TeleVerificationFormDB.findById(formID);
				break;
			default:
				throw new CustomError(ERRORS.INVALID_FIELDS);
		}

		if (verificationForm) {
			return verificationForm;
		}

		throw new CustomError(ERRORS.NOT_FOUND);
	}

	public async resignTask(taskId: Types.ObjectId, assignTo: Types.ObjectId) {
		const { modifiedCount } = await TaskDB.updateOne(
			{
				_id: taskId,
			},
			{
				$set: { assignedTo: assignTo },
				$addToSet: { agentsInvolved: assignTo },
			}
		);

		return modifiedCount > 0;
	}

	public static async getAssignedTasks(
		agentId: Types.ObjectId,
		query: Partial<{
			date_range?: {
				start: Date;
				end: Date;
			};
			priority: 'low' | 'medium' | 'high';
			status: TaskStatus;
		}>
	) {
		let docs = await TaskDB.aggregate([
			{
				$match: {
					$and: [
						{ agentsInvolved: agentId },
						{
							...(query.date_range && {
								due_date: {
									$gte: query.date_range.start,
									$lte: query.date_range.end,
								},
							}),
						},
						{ ...(query.priority && { priority: query.priority }) },
						{ ...(query.status && { status: query.status }) },
					],
				},
			},
			{
				$lookup: {
					from: AccountDB.collection.name,
					localField: 'assignedTo',
					foreignField: '_id',
					as: 'assignedTo',
				},
			},
			{
				$project: {
					_id: 1,

					assigned_to: {
						$map: {
							input: '$assigned_to',
							as: 'assigned',
							in: {
								id: '$$assigned._id',
								name: '$$assigned.name',
							},
						},
					},
					title: 1,
					description: 1,
					priority: 1,
					dueDate: 1,
					completedAt: 1,
					status: 1,
					formattedDate: {
						$dateToString: { format: '%Y-%m-%d', date: '$due_date' },
					},
					priorityValue: {
						$switch: {
							branches: [
								{ case: { $eq: ['$priority', 'high'] }, then: 1 },
								{ case: { $eq: ['$priority', 'medium'] }, then: 2 },
								{ case: { $eq: ['$priority', 'low'] }, then: 3 },
							],
							default: 4, // Assign a default value for any unexpected priority values
						},
					},
				},
			},
		]);

		docs = docs.sort((a, b) => {
			const momentA = DateUtils.getMoment(a.due_date).startOf('day');
			const momentB = DateUtils.getMoment(b.due_date).startOf('day');

			if (momentA.isBefore(momentB)) {
				return -1;
			} else if (momentA.isAfter(momentB)) {
				return 1;
			}
			return a.priorityValue - b.priorityValue;
		});

		return docs.map(processDocs);
	}
}

function processDocs(doc: any): {
	id: IDType;
	title: string;
	description?: string;
	priority: 'low' | 'medium' | 'high';
	dueDate: string;
	relativeDate: string;
	assigned_to: {
		id: string;
		name: string;
		email: string;
	}[];
	createdAt: string;
	status: string;
	isOverdue: boolean;
} {
	return {
		id: doc._id as IDType,
		title: doc.title as string,
		description: doc.description as string,
		priority: doc.priority as 'low' | 'medium' | 'high',
		createdAt: DateUtils.getMoment(doc.createdAt).format('MMM Do, YYYY hh:mm A'),
		dueDate: DateUtils.getMoment(doc.dueDate).format('MMM Do, YYYY hh:mm A'),
		relativeDate: DateUtils.getMoment(doc.dueDate).fromNow(),
		assigned_to: doc.assigned_to.map((e: any) => {
			return {
				id: e.id as string,
				name: e.name as string,
			};
		}),
		status: doc.status,
		isOverdue:
			doc.status === 'completed'
				? DateUtils.getMoment(doc.due_date).isBefore(doc.completedAt)
				: DateUtils.getMoment(doc.due_date).isBefore(DateUtils.getMomentNow()),
	};
}
