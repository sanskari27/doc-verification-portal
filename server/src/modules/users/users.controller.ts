import { NextFunction, Request, Response } from 'express';
import { UserLevel } from '../../config/const';
import { AUTH_ERRORS, CustomError } from '../../errors';
import COMMON_ERRORS from '../../errors/common-errors';
import { UserService } from '../../services';
import { Respond } from '../../utils/ExpressUtils';
import { CreateAgentValidationResult } from './users.validator';
export const JWT_EXPIRE_TIME = 3 * 60 * 1000;
export const SESSION_EXPIRE_TIME = 28 * 24 * 60 * 60 * 1000;

async function getAdmins(req: Request, res: Response, next: NextFunction) {
	try {
		const users = await req.locals.user.getUsers();
		return Respond({
			res,
			status: 200,
			data: { users },
		});
	} catch (err) {
		if (err instanceof CustomError) return next(err);
		return next(new CustomError(COMMON_ERRORS.INTERNAL_SERVER_ERROR));
	}
}

async function createAgent(req: Request, res: Response, next: NextFunction) {
	const { email, name, phone, password } = req.locals.data as CreateAgentValidationResult;
	try {
		if (req.locals.user.userLevel < UserLevel.Admin) {
			return next(new CustomError(AUTH_ERRORS.PERMISSION_DENIED));
		}
		const id = await UserService.register(email, password, {
			name,
			phone,
			level: UserLevel.Agent,
			linked_to: req.locals.user.userId,
		});

		return Respond({
			res,
			status: 200,
			data: {
				id,
				email,
				name,
				phone,
			},
		});
	} catch (err) {
		return next(new CustomError(AUTH_ERRORS.USER_ALREADY_EXISTS));
	}
}

async function updateAgent(req: Request, res: Response, next: NextFunction) {
	const { email, name, phone } = req.locals.data as CreateAgentValidationResult;
	const { id, user } = req.locals;
	try {
		const details = await user.updateAgentDetails(id, {
			email,
			name,
			phone,
		});

		return Respond({
			res,
			status: 200,
			data: {
				...details,
			},
		});
	} catch (err) {
		return next(new CustomError(AUTH_ERRORS.USER_NOT_FOUND_ERROR));
	}
}

async function getAgents(req: Request, res: Response, next: NextFunction) {
	const { user, serviceUser } = req.locals;
	try {
		let list = await serviceUser.getAgents();
		if (user.userLevel === UserLevel.Agent) {
			return Respond({
				res,
				status: 200,
				data: {
					list: list.map((agent) => ({
						id: agent.id,
						email: agent.email,
						name: agent.name,
						phone: agent.phone,
					})),
				},
			});
		}
		return Respond({
			res,
			status: 200,
			data: {
				list,
			},
		});
	} catch (err) {
		return next(new CustomError(AUTH_ERRORS.PERMISSION_DENIED));
	}
}

async function removeAgent(req: Request, res: Response, next: NextFunction) {
	const { id, user } = req.locals;
	user.removeAgent(id);

	return Respond({
		res,
		status: 200,
	});
}

const Controller = {
	getAdmins,
	getAgents,
	createAgent,
	updateAgent,
	removeAgent,
};

export default Controller;
