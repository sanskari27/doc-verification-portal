import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';
import { z } from 'zod';
import { UserLevel } from '../../config/const';
import { CustomError } from '../../errors';
import { idSchema } from '../../utils/schema';

export type UpgradePlanValidationResult = {
	date: string;
	plan_id?: Types.ObjectId;
};

export type AssignTaskValidationResult = {
	message: string;
	assign_to?: Types.ObjectId | undefined;
	due_date?: string | undefined;
};

export type CreateAgentValidationResult = {
	email: string;
	password: string;
	name: string;
	phone: string;
	level: UserLevel;
};

export type PasswordValidationResult = {
	password: string;
};

export async function UpgradePlanValidator(req: Request, res: Response, next: NextFunction) {
	const reqValidator = z.object({
		date: z.string().trim(),
		plan_id: idSchema.optional(),
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

export async function CreateAgentValidator(req: Request, res: Response, next: NextFunction) {
	const reqValidator = z.object({
		name: z.string().trim(),
		phone: z.string().trim(),
		email: z.string().trim().email(),
		password: z.string().trim().min(6),
		level: z
			.number()
			.int()
			.refine(
				(value) =>
					value === UserLevel.Agent || value === UserLevel.Admin || value === UserLevel.Master
			),
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

export async function PasswordValidator(req: Request, res: Response, next: NextFunction) {
	const reqValidator = z.object({
		password: z.string().trim().min(6),
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

export async function CreateQuickReplyValidator(req: Request, res: Response, next: NextFunction) {
	const reqValidator = z.object({
		message: z.string().trim(),
	});

	const reqValidatorResult = reqValidator.safeParse(req.body);

	if (reqValidatorResult.success) {
		req.locals.data = reqValidatorResult.data.message;
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

export async function AssignTaskValidator(req: Request, res: Response, next: NextFunction) {
	const reqValidator = z.object({
		message: z.string().trim(),
		assign_to: z
			.string()
			.trim()
			.refine((value) => Types.ObjectId.isValid(value))
			.transform((value) => new Types.ObjectId(value))
			.optional(),
		due_date: z.string().trim().optional(),
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
