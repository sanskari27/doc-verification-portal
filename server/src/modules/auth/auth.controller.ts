import { NextFunction, Request, Response } from 'express';
import { JwtPayload, verify } from 'jsonwebtoken';
import { Cookie, REFRESH_SECRET, UserLevel } from '../../config/const';
import { AUTH_ERRORS, CustomError } from '../../errors';
import { AccountService } from '../../services';
import { clearCookie, Respond, setCookie } from '../../utils/ExpressUtils';
import {
	LoginValidationResult,
	OTPValidationResult,
	UpdateAccountValidationResult,
} from './auth.validator';
export const JWT_EXPIRE_TIME = 3 * 60 * 1000;
export const SESSION_EXPIRE_TIME = 28 * 24 * 60 * 60 * 1000;

async function getLoginOtp(req: Request, res: Response, next: NextFunction) {
	const { email } = req.locals.data as LoginValidationResult;

	try {
		const { otp, token } = await AccountService.generateLoginToken(email);
		console.log(otp);

		return Respond({
			res,
			status: 200,
			data: {
				token,
			},
		});
	} catch (err) {
		return next(new CustomError(AUTH_ERRORS.USER_NOT_FOUND_ERROR));
	}
}

async function login(req: Request, res: Response, next: NextFunction) {
	const { otp, token } = req.locals.data as OTPValidationResult;

	try {
		const { authToken, refreshToken, userService } = await AccountService.login(token, otp, {
			platform: req.useragent?.platform || '',
			browser: req.useragent?.browser || '',
		});

		setCookie(res, {
			key: Cookie.Auth,
			value: authToken,
			expires: JWT_EXPIRE_TIME,
		});

		setCookie(res, {
			key: Cookie.Refresh,
			value: refreshToken,
			expires: SESSION_EXPIRE_TIME,
		});

		return Respond({
			res,
			status: 200,
			data: {
				isAdmin: userService.userLevel === UserLevel.Admin,
				isAgent:
					userService.userLevel === UserLevel.Agent ||
					userService.userLevel === UserLevel.DummyAgent,
				isMaster: userService.userLevel === UserLevel.Master,
			},
		});
	} catch (err) {
		return next(new CustomError(AUTH_ERRORS.USER_NOT_FOUND_ERROR));
	}
}

//TODO
async function register(req: Request, res: Response, next: NextFunction) {
	// const { email, name, phone, password } = req.locals.data as RegisterValidationResult;
	// try {
	// 	await AccountService.register(email, password, {
	// 		name,
	// 		phone,
	// 		level: UserLevel.Master,
	// 	});
	// 	// const { authToken, refreshToken, userService } = await AccountService.loginById()
	// 	setCookie(res, {
	// 		key: Cookie.Auth,
	// 		value: authToken,
	// 		expires: JWT_EXPIRE_TIME,
	// 	});
	// 	setCookie(res, {
	// 		key: Cookie.Refresh,
	// 		value: refreshToken,
	// 		expires: SESSION_EXPIRE_TIME,
	// 	});
	// 	return Respond({
	// 		res,
	// 		status: 200,
	// 		data: {
	// 			isAdmin: userService.userLevel === UserLevel.Admin,
	// 			isAgent:
	// 				userService.userLevel === UserLevel.Agent ||
	// 				userService.userLevel === UserLevel.DummyAgent,
	// 			isMaster: userService.userLevel === UserLevel.Master,
	// 		},
	// 	});
	// } catch (err) {
	// 	return next(new CustomError(AUTH_ERRORS.USER_ALREADY_EXISTS));
	// }
}

async function validateAuth(req: Request, res: Response, next: NextFunction) {
	const { user } = req.locals;
	return Respond({
		res,
		status: 200,
		data: {
			isAdmin: user.userLevel === UserLevel.Admin,
			isAgent: user.userLevel === UserLevel.Agent || user.userLevel === UserLevel.DummyAgent,
			isMaster: user.userLevel === UserLevel.Master,
		},
	});
}

async function details(req: Request, res: Response, next: NextFunction) {
	const { user } = req.locals;
	const details = await user.getDetails();
	const account = {
		...details,
		isAdmin: user.userLevel === UserLevel.Admin,
		isAgent: user.userLevel === UserLevel.Agent || user.userLevel === UserLevel.DummyAgent,
		isMaster: user.userLevel === UserLevel.Master,
	};

	return Respond({
		res,
		status: 200,
		data: {
			account,
		},
	});
}

async function updateDetails(req: Request, res: Response, next: NextFunction) {
	const { user, data } = req.locals;

	await user.updateDetails(data as UpdateAccountValidationResult);

	return Respond({
		res,
		status: 200,
	});
}

async function logout(req: Request, res: Response, next: NextFunction) {
	try {
		const _refresh_id = req.cookies[Cookie.Refresh];
		const decoded = verify(_refresh_id, REFRESH_SECRET) as JwtPayload;
		AccountService.markLogout(decoded.id);
	} catch (err) {
		//ignored
	}
	clearCookie(res, Cookie.Auth);
	clearCookie(res, Cookie.Refresh);
	return Respond({
		res,
		status: 200,
	});
}

const Controller = {
	validateAuth,
	getLoginOtp,
	login,
	register,
	logout,
	details,
	updateDetails,
};

export default Controller;
