/* eslint-disable @typescript-eslint/no-unused-vars */
import API from '../config/API';

export default class AgentService {
	static async listedAgents() {
		const { data } = await API.get('/users/agents');
		return data.agents as {
			id: string;
			email: string;
			name: string;
			phone: string;
		}[];
	}
	static async addAgent(details: { email: string; name: string; phone: string }) {
		try {
			await API.post('/users/agents', details);
			return true;
		} catch (err: unknown) {
			return false;
		}
	}
}
