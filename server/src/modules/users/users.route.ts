import express from 'express';
import { UserLevel } from '../../config/const';
import { IDValidator, VerifyMinLevel } from '../../middleware';
import Controller from './users.controller';
import { CreateUserValidator } from './users.validator';

const router = express.Router();

router
	.route('/admins')
	.get(VerifyMinLevel(UserLevel.Master), Controller.listAdmins)
	.post(VerifyMinLevel(UserLevel.Master), CreateUserValidator, Controller.addAdmin);

router
	.route('/agents/:id')
	.delete(IDValidator, Controller.removeAgent);

router.route('/agents').get(Controller.listAgents).post(CreateUserValidator, Controller.addAgent);

export default router;
