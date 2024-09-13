import { NextFunction, Request, Response } from 'express';
import { JwtPayload, verify } from 'jsonwebtoken';
import { Cookie, JWT_SECRET, REFRESH_SECRET, SESSION_EXPIRE_TIME } from '../config/const';
import { CustomError } from '../errors';
import AUTH_ERRORS from '../errors/auth-errors';
import { AccountService, SessionService } from '../services';
import userServiceFactory from '../services/user/userServiceFactory';
import { setCookie } from '../utils/ExpressUtils';

export default async function VerifySession(req: Request, res: Response, next: NextFunction) {
	const _auth_id = req.cookies[Cookie.Auth];
	const _refresh_id = req.cookies[Cookie.Refresh];

	let session;

	try {
		const decoded = verify(_auth_id, JWT_SECRET) as JwtPayload;
		session = await SessionService.findSessionById(decoded.id);
	} catch (err) {
		try {
			const decoded = verify(_refresh_id, REFRESH_SECRET) as JwtPayload;
			session = await SessionService.findSessionByRefreshToken(decoded.id);
		} catch (err) {}
	}

	if (!session) {
		return next(new CustomError(AUTH_ERRORS.SESSION_INVALIDATED));
	}

	const accountService = await AccountService.findById(session.userId);
	req.locals.user = userServiceFactory(accountService.account);

	setCookie(res, {
		key: Cookie.Auth,
		value: session.authToken,
		expires: SESSION_EXPIRE_TIME,
	});
	return next();
}

export function VerifyMinLevel(level: number) {
	function validator(req: Request, res: Response, next: NextFunction) {
		if (req.locals.user && req.locals.user.userLevel >= level) {
			return next();
		}

		return next(new CustomError(AUTH_ERRORS.PERMISSION_DENIED));
	}
	return validator;
}
