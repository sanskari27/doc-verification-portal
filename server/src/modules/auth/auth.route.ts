import express from 'express';
import { VerifySession } from '../../middleware';
import Controller from './auth.controller';
import {
	LoginAccountValidator,
	OTPValidator,
	RegisterAccountValidator,
	UpdateAccountValidator,
} from './auth.validator';

const router = express.Router();

router.route('/validate-auth').all(VerifySession).get(Controller.validateAuth);

router
	.route('/details')
	.all(VerifySession)
	.get(Controller.details)
	.post(UpdateAccountValidator, Controller.updateDetails);

router.route('/request-login').all(LoginAccountValidator).post(Controller.getLoginOtp);

router.route('/login').all(OTPValidator).post(Controller.login);

router.route('/register').all(RegisterAccountValidator).post(Controller.register);

router.route('/logout').post(Controller.logout);

export default router;
