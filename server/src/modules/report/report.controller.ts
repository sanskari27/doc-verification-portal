import { NextFunction, Request, Response } from 'express';
import { CustomError, ERRORS } from '../../errors';
import TaskService from '../../services/task/task';
import MasterService from '../../services/user/master';
import CSVHelper from '../../utils/CSVHelper';
import { Respond, RespondCSV } from '../../utils/ExpressUtils';
import { FetchQueryType } from './report.validator';

async function report(req: Request, res: Response, next: NextFunction) {
	const query = req.locals.query as FetchQueryType;
	const userService = req.locals.user;
	const taskService = new TaskService(userService);

	try {
		let data;
		if (userService instanceof MasterService) {
			data = await taskService.generateReport({ ...query, masterAccess: true });
		} else {
			data = await taskService.generateReport(query);
		}

		if (query.export) {
			RespondCSV({
				res,
				filename: 'report.csv',
				data: CSVHelper.exportReport(data),
			});
		} else {
			Respond({
				res,
				status: 200,
				data: {
					data,
				},
			});
		}
	} catch (err) {
		console.log(err);

		if (err instanceof CustomError) {
			return next(err);
		}
		return next(new CustomError(ERRORS.INTERNAL_SERVER_ERROR));
	}
}

const Controller = {
	report,
};

export default Controller;
