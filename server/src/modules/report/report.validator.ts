import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { TaskStatus } from '../../config/const';
import { CustomError } from '../../errors';
import DateUtils from '../../utils/DateUtils';

export type FetchQueryType = {
	priority?: 'low' | 'medium' | 'high';
	status: TaskStatus;
	date_range?: {
		start: Date;
		end: Date;
	};
	export?: boolean;
};
export function FetchQueryValidator(req: Request, res: Response, next: NextFunction) {
	const statusValidator = z.enum([
		TaskStatus.Pending,
		TaskStatus.InProgress,
		TaskStatus.Paused,
		TaskStatus.AcceptedUnderReview,
		TaskStatus.RejectedUnderReview,
		TaskStatus.Completed,
		TaskStatus.Rejected,
	]);

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
			export: z
				.string()
				.transform((val) => val === 'true')
				.optional(),
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
