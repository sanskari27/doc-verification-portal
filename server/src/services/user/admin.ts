import { Types } from 'mongoose';
import { AccountDB } from '../../../mongo';
import IAccount from '../../../mongo/types/account';
import { UserLevel } from '../../config/const';
import { AUTH_ERRORS, CustomError } from '../../errors';
import { generateText } from '../../utils/ExpressUtils';
import AccountService from '../auth/account';
import AgentService from './agent';

export default class AdminService extends AccountService {
	public constructor(account: IAccount) {
		if (account.userLevel !== UserLevel.Master) {
			throw new CustomError(AUTH_ERRORS.USER_NOT_FOUND_ERROR);
		}
		super(account);
	}

	static async addAdmin(details: {
		email: string;
		name: string;
		phone: string;
		parent: Types.ObjectId;
	}) {
		const id = await AccountService.register(details.email, generateText(4), {
			...details,
			level: UserLevel.Admin,
		});
		return {
			id: id,
			email: details.email,
			name: details.name,
			phone: details.phone,
		};
	}

	static async listAdmins({ parent }: { parent: Types.ObjectId }) {
		const admins = await AccountDB.find({
			userLevel: UserLevel.Admin,
			parent: parent,
		});

		return admins.map((admin) => ({
			id: admin._id,
			email: admin.email,
			name: admin.name,
			phone: admin.phone,
		}));
	}

	async addAgent(details: { email: string; name: string; phone: string }) {
		return await AgentService.addAgent({
			...details,
			type: 'agent',
			parent: this.userId,
		});
	}

	async listAgents() {
		return await AgentService.listAgents({
			parent: this.userId,
		});
	}

	async removeAgent(agentId: Types.ObjectId) {
		AgentService.removeAgent({
			agentId,
			parent: this.userId,
		});
	}
}
