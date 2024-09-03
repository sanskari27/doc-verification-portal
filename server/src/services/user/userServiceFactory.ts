import IAccount from '../../../mongo/types/account';
import { UserLevel } from '../../config/const';
import AdminService from './admin';
import AgentService from './agent';
import MasterService from './master';

export default function (account: IAccount) {
	if (account.userLevel === UserLevel.Master) {
		return new MasterService(account);
	} else if (account.userLevel === UserLevel.Admin) {
		return new AdminService(account);
	} else {
		return new AgentService(account);
	}
}
