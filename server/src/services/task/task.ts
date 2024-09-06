import { Types } from 'mongoose';
import { TaskDB } from '../../../mongo';
import { UserLevel } from '../../config/const';
import { CustomError, ERRORS } from '../../errors';
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
			agentsInvolved: [this._account.userId],
		});

		return task._id;
	}

	// public async updateVerificationForm(taskId: Types.ObjectId, verificationForm: IVerificationForm) {
	// 	// const verificationFormId =
	// }
}
