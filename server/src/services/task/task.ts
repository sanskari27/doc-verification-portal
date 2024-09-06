import { Types } from 'mongoose';
import { TaskDB } from '../../../mongo';
import VerificationForm from '../../../mongo/repo/VerificationForm';
import { IVerificationForm } from '../../../mongo/types/verificationForm';
import { UserLevel } from '../../config/const';
import { CustomError, ERRORS } from '../../errors';
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

	public async updateVerificationForm(
		taskId: Types.ObjectId,
		verificationForm: Partial<IVerificationForm>
	) {
		const { task_id: _, ...data } = verificationForm;
		const verificationFormData = filterUndefinedKeys(data);
		const updated = await VerificationForm.updateOne({ task_id: taskId }, verificationFormData);
		return updated.modifiedCount > 0;
	}
}
