import { Types } from 'mongoose';
import { AccountDB } from '../../../mongo';
import IAccount from '../../../mongo/types/account';
import { UserLevel } from '../../config/const';
import { AUTH_ERRORS, CustomError } from '../../errors';
import { generateText } from '../../utils/ExpressUtils';
import AccountService from '../auth/account';

export default class AgentService extends AccountService {
	public constructor(account: IAccount) {
		if (account.userLevel !== UserLevel.Master) {
			throw new CustomError(AUTH_ERRORS.USER_NOT_FOUND_ERROR);
		}
		super(account);
	}

	static async addAgent(details: {
		email: string;
		name: string;
		phone: string;
		parent: Types.ObjectId;
		type: 'agent' | 'dummy-agent';
	}) {
		const id = await AccountService.register(details.email, generateText(4), {
			...details,
			level: details.type === 'agent' ? UserLevel.Agent : UserLevel.DummyAgent,
		});
		return {
			id: id,
			email: details.email,
			name: details.name,
			phone: details.phone,
		};
	}

	static async removeAgent({
		agentId,
		parent,
	}: {
		agentId: Types.ObjectId;
		parent: Types.ObjectId;
	}) {
		const agent = await AccountDB.findOne({
			_id: agentId,
			userLevel: UserLevel.Agent,
			parent: parent,
		});
		if (!agent) {
			throw new CustomError(AUTH_ERRORS.USER_NOT_FOUND_ERROR);
		}

		AccountDB.deleteOne({ _id: agentId });

		const deleted = [agentId];

		const queue = [agentId];
		while (queue.length > 0) {
			const current = queue.shift();
			const sub_agents = await AccountDB.find({ parent: current });
			deleted.push(...sub_agents.map((child) => child._id));
			queue.push(...sub_agents.map((child) => child._id));
			AccountDB.deleteMany({ parent: current });
		}

		//TODO delete all the tasks of the deleted agents
	}

	static async listAgents({ parent }: { parent: Types.ObjectId }) {
		const admins = await AccountDB.find({
			userLevel: UserLevel.Agent,
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
			type: 'dummy-agent',
			parent: this.userId,
		});
	}

	async listAgents() {
		return await AgentService.listAgents({
			parent: this.userId,
		});
	}
}
