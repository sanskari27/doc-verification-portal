import { NextFunction, Request, Response } from 'express';
import { CustomError, ERRORS } from '../../errors';
import ReportService from '../../services/task/report';
import MasterService from '../../services/user/master';
import CSVHelper from '../../utils/CSVHelper';
import { Delay, Respond, RespondCSV } from '../../utils/ExpressUtils';
import { FetchQueryType } from './report.validator';

async function report(req: Request, res: Response, next: NextFunction) {
	const query = req.locals.query as FetchQueryType;
	const userService = req.locals.user;
	const reportService = new ReportService(userService);

	try {
		await Delay(5);
		let data;
		if (userService instanceof MasterService) {
			data = await reportService.generateReport({ ...query, masterAccess: true });
		} else {
			data = await reportService.generateReport(query);
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

async function previousRecordsSummary(req: Request, res: Response, next: NextFunction) {
	const limit = isNaN(Number(req.query.limit)) ? 5 : Number(req.query.limit);
	const userService = req.locals.user;
	const reportService = new ReportService(userService);

	try {
		let data;
		if (userService instanceof MasterService) {
			data = await reportService.previousRecordsSummary({ limit, masterAccess: true });
		} else {
			data = await reportService.previousRecordsSummary({ limit });
		}

		Respond({
			res,
			status: 200,
			data: {
				records: data,
			},
		});
	} catch (err) {
		console.log(err);

		if (err instanceof CustomError) {
			return next(err);
		}
		return next(new CustomError(ERRORS.INTERNAL_SERVER_ERROR));
	}
}

async function cityBasedSummary(req: Request, res: Response, next: NextFunction) {
	const limit = isNaN(Number(req.query.limit)) ? 5 : Number(req.query.limit);
	const userService = req.locals.user;
	const reportService = new ReportService(userService);

	try {
		let data;
		if (userService instanceof MasterService) {
			data = await reportService.cityBasedSummary({ limit, masterAccess: true });
		} else {
			data = await reportService.cityBasedSummary({ limit });
		}

		Respond({
			res,
			status: 200,
			data: {
				records: data,
			},
		});
	} catch (err) {
		console.log(err);

		if (err instanceof CustomError) {
			return next(err);
		}
		return next(new CustomError(ERRORS.INTERNAL_SERVER_ERROR));
	}
}

async function monthlyReport(req: Request, res: Response, next: NextFunction) {
	const year = isNaN(Number(req.query.year)) ? new Date().getFullYear() : Number(req.query.year);
	const userService = req.locals.user;
	const reportService = new ReportService(userService);

	try {
		let data;
		if (userService instanceof MasterService) {
			data = await reportService.monthlyReport({ year, masterAccess: true });
		} else {
			data = await reportService.monthlyReport({ year });
		}

		Respond({
			res,
			status: 200,
			data: {
				records: data,
			},
		});
	} catch (err) {
		console.log(err);

		if (err instanceof CustomError) {
			return next(err);
		}
		return next(new CustomError(ERRORS.INTERNAL_SERVER_ERROR));
	}
}

async function monthReport(req: Request, res: Response, next: NextFunction) {
	const month = isNaN(Number(req.query.month))
		? new Date().getMonth() + 1
		: Number(req.query.month);
	const year = isNaN(Number(req.query.year)) ? new Date().getFullYear() : Number(req.query.year);
	const userService = req.locals.user;
	const reportService = new ReportService(userService);

	try {
		let data;
		if (userService instanceof MasterService) {
			data = await reportService.monthReport({ month, year, masterAccess: true });
		} else {
			data = await reportService.monthReport({ month, year });
		}

		Respond({
			res,
			status: 200,
			data: {
				records: data,
			},
		});
	} catch (err) {
		console.log(err);

		if (err instanceof CustomError) {
			return next(err);
		}
		return next(new CustomError(ERRORS.INTERNAL_SERVER_ERROR));
	}
}

async function summary(req: Request, res: Response, next: NextFunction) {
	const userService = req.locals.user;
	const reportService = new ReportService(userService);

	try {
		let data;
		if (userService instanceof MasterService) {
			data = await reportService.summary({ masterAccess: true });
		} else {
			data = await reportService.summary();
		}

		return Respond({
			res,
			status: 200,
			data: {
				summary: data,
			},
		});
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
	previousRecordsSummary,
	cityBasedSummary,
	monthlyReport,
	monthReport,
	summary,
};

export default Controller;
