import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';
import { z } from 'zod';
import { TaskStatus } from '../../config/const';
import { CustomError } from '../../errors';
import DateUtils from '../../utils/DateUtils';
import { idSchema } from '../../utils/schema';

export type CreateTaskValidationResult = {
	applicantName: string;
	assignedTo: Types.ObjectId;
	dueDate: Date;
	priority: 'low' | 'medium' | 'high';
	verificationType: 'nri' | 'business' | 'non-business';
	title: string;
	description?: string | undefined;
};

export type UpdateTaskValidationResult = {
	dueDate?: Date;
	priority?: 'low' | 'medium' | 'high';
	title?: string;
	description?: string;
};

export type FetchQueryType = {
	priority?: 'low' | 'medium' | 'high';
	status: TaskStatus;
	date_range?: {
		start: Date;
		end: Date;
	};
};

export type AssignValidationResult = {
	agentId: Types.ObjectId;
};

export type TaskStatusValidationResult = {
	status: TaskStatus;
};

export async function CreateTaskValidator(req: Request, res: Response, next: NextFunction) {
	const reqValidator = z.object({
		applicantName: z.string().trim().min(1),
		assignedTo: idSchema,
		dueDate: z
			.string()
			.trim()
			.transform((val) => DateUtils.getMoment(val).toDate()),
		priority: z.enum(['low', 'medium', 'high']),
		verificationType: z.enum(['nri', 'business', 'non-business']),
		title: z.string().trim().min(1),
		description: z.string().trim().optional(),
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

export async function UpdateTaskValidator(req: Request, res: Response, next: NextFunction) {
	const reqValidator = z.object({
		dueDate: z
			.string()
			.trim()
			.transform((val) => DateUtils.getMoment(val).toDate())
			.optional(),

		priority: z.enum(['low', 'medium', 'high']).optional(),
		title: z.string().trim().min(1).optional(),
		description: z.string().trim().optional(),
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

const statusValidator = z.enum([
	TaskStatus.Pending,
	TaskStatus.InProgress,
	TaskStatus.Paused,
	TaskStatus.AcceptedUnderReview,
	TaskStatus.RejectedUnderReview,
	TaskStatus.Completed,
	TaskStatus.Rejected,
]);

export function FetchQueryValidator(req: Request, res: Response, next: NextFunction) {
	const reqValidator = z
		.object({
			start_date: z
				.string()
				.transform((val) => DateUtils.getMoment(val).startOf('day').toDate())
				.optional(),
			end_date: z
				.string()
				.transform((val) => DateUtils.getMoment(val).endOf('day').toDate())
				.optional(),

			priority: z.enum(['low', 'medium', 'high']).optional(),
			status: statusValidator.optional(),
		})
		.refine((value) => {
			if (!value.start_date && value.end_date) return false;
			else if (value.start_date && !value.end_date) return false;
			else if (value.start_date && value.end_date) {
				if (DateUtils.getMoment(value.start_date).isAfter(DateUtils.getMoment(value.end_date)))
					return false;
			}
			return true;
		});

	const reqValidatorResult = reqValidator.safeParse(req.query);

	if (reqValidatorResult.success) {
		const data = reqValidatorResult.data;
		req.locals.query = {
			...data,
			...(data.start_date &&
				data.end_date && {
					date_range: {
						start: data.start_date,
						end: data.end_date,
					},
				}),
		};
		return next();
	}

	return next(
		new CustomError({
			STATUS: 400,
			TITLE: 'INVALID_FIELDS',
			MESSAGE: "Invalid fields in the request's query.",
			OBJECT: reqValidatorResult.error.flatten(),
		})
	);
}

export function AssignValidator(req: Request, res: Response, next: NextFunction) {
	const reqValidator = z.object({
		agentId: idSchema,
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

export function TaskStatusValidator(req: Request, res: Response, next: NextFunction) {
	const reqValidator = z.object({
		status: statusValidator.optional(),
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

export function NameValidator(req: Request, res: Response, next: NextFunction) {
	const reqValidator = z.object({
		name: z.string().trim().min(1),
	});

	const reqValidatorResult = reqValidator.safeParse(req.body);

	if (reqValidatorResult.success) {
		req.locals.data = reqValidatorResult.data.name;
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
