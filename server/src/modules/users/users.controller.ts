import { NextFunction, Request, Response } from 'express';
import { CustomError, ERRORS } from '../../errors';
import AdminService from '../../services/user/admin';
import MasterService from '../../services/user/master';
import { Respond } from '../../utils/ExpressUtils';
import { CreateUserValidationResult } from './users.validator';

export const JWT_EXPIRE_TIME = 3 * 60 * 1000;
export const SESSION_EXPIRE_TIME = 28 * 24 * 60 * 60 * 1000;

async function addAdmin(req: Request, res: Response, next: NextFunction) {
	const data = req.locals.data as CreateUserValidationResult;
	const userService = req.locals.user;

	if (!(userService instanceof MasterService)) {
		return next(new CustomError(ERRORS.PERMISSION_DENIED));
	}

	try {
		const admin = await userService.addAdmin(data);
		Respond({
			res,
			status: 200,
			data: { admin },
		});
	} catch (err) {
		if (err instanceof CustomError) {
			return next(err);
		}
		return next(new CustomError(ERRORS.INTERNAL_SERVER_ERROR));
	}
}

async function listAdmins(req: Request, res: Response, next: NextFunction) {
	const userService = req.locals.user;

	if (!(userService instanceof MasterService)) {
		return next(new CustomError(ERRORS.PERMISSION_DENIED));
	}

	try {
		const admins = await userService.listAdmins();
		Respond({
			res,
			status: 200,
			data: { admins },
		});
	} catch (err) {
		if (err instanceof CustomError) {
			return next(err);
		}
		return next(new CustomError(ERRORS.INTERNAL_SERVER_ERROR));
	}
}

async function addAgent(req: Request, res: Response, next: NextFunction) {
	const data = req.locals.data as CreateUserValidationResult;
	const userService = req.locals.user;

	try {
		const agent = await userService.addAgent(data);
		Respond({
			res,
			status: 200,
			data: { admin: agent },
		});
	} catch (err) {
		if (err instanceof CustomError) {
			return next(err);
		}
		return next(new CustomError(ERRORS.INTERNAL_SERVER_ERROR));
	}
}

async function removeAgent(req: Request, res: Response, next: NextFunction) {
	const agentId = req.locals.id;
	const userService = req.locals.user;

	if (!(userService instanceof MasterService) && !(userService instanceof AdminService)) {
		return next(new CustomError(ERRORS.PERMISSION_DENIED));
	}
	try {
		await userService.removeAgent(agentId);
		Respond({
			res,
			status: 200,
			data: { message: 'Agent removed successfully' },
		});
	} catch (err) {
		if (err instanceof CustomError) {
			return next(err);
		}
		return next(new CustomError(ERRORS.INTERNAL_SERVER_ERROR));
	}
}

async function listAgents(req: Request, res: Response, next: NextFunction) {
	const userService = req.locals.user;

	try {
		const agents = await userService.listAgents();
		Respond({
			res,
			status: 200,
			data: { agents },
		});
	} catch (err) {
		if (err instanceof CustomError) {
			return next(err);
		}
		return next(new CustomError(ERRORS.INTERNAL_SERVER_ERROR));
	}
}

const Controller = {
	addAdmin,
	addAgent,
	listAdmins,
	listAgents,
	removeAgent,
};

export default Controller;
