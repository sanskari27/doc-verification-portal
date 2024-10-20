import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { MASTER_KEY } from '../../config/const';
import { AUTH_ERRORS, CustomError } from '../../errors';

export type LoginValidationResult = {
	email: string;
};

export type OTPValidationResult = {
	otp: string;
	token: string;
};

export type RegisterValidationResult = {
	email: string;
	password: string;
	name: string;
	phone: string;
};

export type UpdateAccountValidationResult = {
	name?: string;
	phone?: string;
	email?: string;
};

export async function LoginAccountValidator(req: Request, res: Response, next: NextFunction) {
	const reqValidator = z.object({
		email: z.string().trim().email(),
	});

	const reqValidatorResult = reqValidator.safeParse(req.body);

	if (reqValidatorResult.success) {
		req.locals.data = reqValidatorResult.data;
		return next();
	}

	return next(
		new CustomError({
			STATUS: 400,
			TITLE: 'INVALID_FIELDS',
			MESSAGE: "Invalid fields in the request's body.",
			OBJECT: reqValidatorResult.error.flatten(),
		})
	);
}

export async function OTPValidator(req: Request, res: Response, next: NextFunction) {
	const reqValidator = z.object({
		otp: z
			.string()
			.trim()
			.min(6, 'OTP must be 6 characters long.')
			.max(6, 'OTP must be 6 characters long.'),
		token: z.string().trim(),
	});

	const reqValidatorResult = reqValidator.safeParse(req.body);

	if (reqValidatorResult.success) {
		req.locals.data = reqValidatorResult.data;
		return next();
	}

	return next(
		new CustomError({
			STATUS: 400,
			TITLE: 'INVALID_FIELDS',
			MESSAGE: "Invalid fields in the request's body.",
			OBJECT: reqValidatorResult.error.flatten(),
		})
	);
}

export async function RegisterAccountValidator(req: Request, res: Response, next: NextFunction) {
	const reqValidator = z.object({
		name: z.string().trim(),
		phone: z.string().trim(),
		email: z.string().trim().email(),
		password: z.string().trim().min(6),
		masterKey: z.string().trim().min(6),
	});

	const reqValidatorResult = reqValidator.safeParse(req.body);

	if (reqValidatorResult.success) {
		if (reqValidatorResult.data.masterKey !== MASTER_KEY) {
			return next(new CustomError(AUTH_ERRORS.PERMISSION_DENIED));
		}
		req.locals.data = reqValidatorResult.data;
		return next();
	}

	return next(
		new CustomError({
			STATUS: 400,
			TITLE: 'INVALID_FIELDS',
			MESSAGE: "Invalid fields in the request's body.",
			OBJECT: reqValidatorResult.error.flatten(),
		})
	);
}

export async function UpdateAccountValidator(req: Request, res: Response, next: NextFunction) {
	const reqValidator = z.object({
		name: z.string().trim().optional(),
		phone: z.string().trim().optional(),
		email: z.string().trim().email().optional(),
	});

	const reqValidatorResult = reqValidator.safeParse(req.body);

	if (reqValidatorResult.success) {
		req.locals.data = reqValidatorResult.data;
		return next();
	}

	return next(
		new CustomError({
			STATUS: 400,
			TITLE: 'INVALID_FIELDS',
			MESSAGE: "Invalid fields in the request's body.",
			OBJECT: reqValidatorResult.error.flatten(),
		})
	);
}
