import { Types } from 'mongoose';
import IAccount from '../../../mongo/types/account';
import { TaskStatus, UserLevel } from '../../config/const';
import { AUTH_ERRORS, CustomError } from '../../errors';
import AccountService from '../auth/account';
import TaskService from '../task/task';
import AdminService from './admin';
import AgentService from './agent';

export default class MasterService extends AccountService {
	public constructor(account: IAccount) {
		if (account.userLevel !== UserLevel.Master) {
			throw new CustomError(AUTH_ERRORS.USER_NOT_FOUND_ERROR);
		}
		super(account);
	}

	async addAdmin(details: { email: string; name: string; phone: string }) {
		const { id } = await AdminService.addAdmin({
			...details,
			parent: this.userId,
		});
		return {
			id,
			email: details.email,
			name: details.name,
			phone: details.phone,
		};
	}

	async listAdmins() {
		return await AdminService.listAdmins({
			parent: this.userId,
		});
	}

	async addAgent(details: { email: string; name: string; phone: string }) {
		return await AgentService.addAgent({
			...details,
			type: 'agent',
			parent: this.userId,
		});
	}

	async removeAgent(agentId: Types.ObjectId) {
		AgentService.removeAgent({
			agentId,
			parent: this.userId,
		});
	}

	async listAgents() {
		return await AgentService.listAgents({
			parent: this.userId,
		});
	}

	async listTasks(
		query: Partial<{
			date_range?: {
				start: Date;
				end: Date;
			};
			priority: 'low' | 'medium' | 'high';
			status: TaskStatus;
		}>
	) {
		return TaskService.assignedTo(this.userId, query);
	}
}
