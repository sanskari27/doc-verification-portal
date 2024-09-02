import express from 'express';
import { UserLevel } from '../../config/const';
import { IDValidator, VerifyMinLevel } from '../../middleware';
import Controller from './users.controller';
import { CreateAgentValidator } from './users.validator';

const router = express.Router();

router.route('/admins').all(VerifyMinLevel(UserLevel.Master)).get(Controller.getAdmins);

router.route('/agents/:id/tasks').all(IDValidator).get(Controller.getAssignedTask);

router
	.route('/agents/:id')
	.all(VerifyMinLevel(UserLevel.Admin), IDValidator)
	.post(CreateAgentValidator, Controller.updateAgent)
	.delete(Controller.removeAgent);

router
	.route('/agents')
	.all(VerifyMinLevel(UserLevel.Agent))
	.get(Controller.getAgents)
	.all(VerifyMinLevel(UserLevel.Admin))
	.post(CreateAgentValidator, Controller.createAgent);

export default router;
