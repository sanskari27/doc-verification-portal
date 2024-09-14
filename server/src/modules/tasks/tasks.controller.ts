import { NextFunction, Request, Response } from 'express';
import { Path } from '../../config/const';
import FileUpload, { ONLY_MEDIA_ALLOWED, SingleFileUploadOptions } from '../../config/FileUpload';
import { CustomError, ERRORS } from '../../errors';
import TaskService from '../../services/task/task';
import AgentService from '../../services/user/agent';
import { Respond } from '../../utils/ExpressUtils';
import FileUtils from '../../utils/FileUtils';
import {
	AssignValidationResult,
	CreateTaskValidationResult,
	FetchQueryType,
	TaskStatusValidationResult,
	UpdateTaskValidationResult,
	VerificationDataResult,
} from './tasks.validator';

export const JWT_EXPIRE_TIME = 3 * 60 * 1000;
export const SESSION_EXPIRE_TIME = 28 * 24 * 60 * 60 * 1000;

async function createTask(req: Request, res: Response, next: NextFunction) {
	const data = req.locals.data as CreateTaskValidationResult;
	const userService = req.locals.user;
	const taskService = new TaskService(userService);

	try {
		const task = await taskService.createTask(data);
		Respond({
			res,
			status: 200,
			data: {
				id: task,
			},
		});
	} catch (err) {
		if (err instanceof CustomError) {
			return next(err);
		}
		return next(new CustomError(ERRORS.INTERNAL_SERVER_ERROR));
	}
}

async function updateTask(req: Request, res: Response, next: NextFunction) {
	const data = req.locals.data as UpdateTaskValidationResult;
	const userService = req.locals.user;
	const taskId = req.locals.id;
	const taskService = new TaskService(userService);

	const success = await taskService.updateTask(taskId, data);

	if (!success) {
		return next(new CustomError(ERRORS.NOT_FOUND));
	}

	Respond({
		res,
		status: 200,
	});
}

async function getTask(req: Request, res: Response, next: NextFunction) {
	const userService = req.locals.user;
	const taskId = req.locals.id;
	const taskService = new TaskService(userService);

	try {
		const task = await taskService.getTask(taskId);

		Respond({
			res,
			status: 200,
			data: {
				task,
			},
		});
	} catch (err) {
		if (err instanceof CustomError) {
			return next(err);
		}
		return next(new CustomError(ERRORS.INTERNAL_SERVER_ERROR));
	}
}

async function assignedToMe(req: Request, res: Response, next: NextFunction) {
	const userService = req.locals.user;

	if (!(userService instanceof AgentService)) {
		return next(new CustomError(ERRORS.PERMISSION_DENIED));
	}

	try {
		const tasks = await userService.assignedToMe(req.locals.query as FetchQueryType);

		Respond({
			res,
			status: 200,
			data: {
				tasks,
			},
		});
	} catch (err) {
		if (err instanceof CustomError) {
			return next(err);
		}
		return next(new CustomError(ERRORS.INTERNAL_SERVER_ERROR));
	}
}

async function assignedByMe(req: Request, res: Response, next: NextFunction) {
	const userService = req.locals.user;

	try {
		const tasks = await userService.assignedByMe(req.locals.query as FetchQueryType);

		Respond({
			res,
			status: 200,
			data: {
				tasks,
			},
		});
	} catch (err) {
		if (err instanceof CustomError) {
			return next(err);
		}
		return next(new CustomError(ERRORS.INTERNAL_SERVER_ERROR));
	}
}

async function getNavigationLink(req: Request, res: Response, next: NextFunction) {
	const taskService = new TaskService(req.locals.user);
	const id = req.locals.id;

	try {
		const link = await taskService.getNavigationLink(id);

		Respond({
			res,
			status: 200,
			data: {
				link,
			},
		});
	} catch (err) {
		if (err instanceof CustomError) {
			return next(err);
		}
		return next(new CustomError(ERRORS.INTERNAL_SERVER_ERROR));
	}
}

async function getFormData(req: Request, res: Response, next: NextFunction) {
	const types = req.query.types as string;
	const id = req.locals.id;
	const taskService = new TaskService(req.locals.user);

	const formInfo: { [key: string]: any } = {};

	if (!types) {
		return next(new CustomError(ERRORS.INVALID_FIELDS));
	}

	try {
		if (types.includes('verification')) {
			formInfo.verification = await taskService.fetchFormData(id, 'verification');
		}
		if (types.includes('business')) {
			formInfo.business = await taskService.fetchFormData(id, 'business');
		}
		if (types.includes('bank')) {
			formInfo.bank = await taskService.fetchFormData(id, 'bank');
		}
		if (types.includes('employment')) {
			formInfo.employment = await taskService.fetchFormData(id, 'employment');
		}
		if (types.includes('income')) {
			formInfo.income = await taskService.fetchFormData(id, 'income');
		}
		if (types.includes('residence')) {
			formInfo.residence = await taskService.fetchFormData(id, 'residence');
		}
		if (types.includes('tele')) {
			formInfo.tele = await taskService.fetchFormData(id, 'tele');
		}

		Respond({
			res,
			status: 200,
			data: {
				formInfo,
			},
		});
	} catch (err) {
		if (err instanceof CustomError) {
			return next(err);
		}
		return next(new CustomError(ERRORS.INTERNAL_SERVER_ERROR));
	}
}

async function updateFormData(req: Request, res: Response, next: NextFunction) {
	const id = req.locals.id;
	const taskService = new TaskService(req.locals.user);
	const data = req.locals.data as VerificationDataResult;

	try {
		switch (data.type) {
			case 'verification-form':
				await taskService.updateVerificationForm(id, data);
				break;
			case 'business-verification':
				await taskService.updateBusinessVerificationForm(id, data);
				break;
			case 'bank-verification':
				await taskService.updateBankVerificationForm(id, data);
				break;
			case 'employment-verification':
				await taskService.updateEmploymentVerificationForm(id, data);
				break;
			case 'income-tax-verification':
				await taskService.updateIncomeTaxVerificationForm(id, data);
				break;
			case 'residence-verification':
				await taskService.updateResidenceVerificationForm(id, data);
				break;
			case 'tele-verification':
				await taskService.updateTeleVerificationForm(id, data);
				break;
			default:
				return next(new CustomError(ERRORS.INVALID_FIELDS));
		}

		Respond({
			res,
			status: 200,
		});
	} catch (err: unknown) {
		if (err instanceof CustomError) {
			return next(err);
		}
		return next(new CustomError(ERRORS.INTERNAL_SERVER_ERROR, err));
	}
}

async function assignTask(req: Request, res: Response, next: NextFunction) {
	const taskId = req.locals.id;
	const { agentId } = req.locals.data as AssignValidationResult;
	const taskService = new TaskService(req.locals.user);

	try {
		await taskService.assignTask(taskId, agentId);

		Respond({
			res,
			status: 200,
		});
	} catch (err) {
		if (err instanceof CustomError) {
			return next(err);
		}
		return next(new CustomError(ERRORS.INTERNAL_SERVER_ERROR));
	}
}

async function transferTask(req: Request, res: Response, next: NextFunction) {
	const taskId = req.locals.id;
	const { agentId } = req.locals.data as AssignValidationResult;
	const taskService = new TaskService(req.locals.user);

	try {
		await taskService.transferTask(taskId, agentId);

		Respond({
			res,
			status: 200,
		});
	} catch (err) {
		if (err instanceof CustomError) {
			return next(err);
		}
		return next(new CustomError(ERRORS.INTERNAL_SERVER_ERROR));
	}
}

async function updateTaskStatus(req: Request, res: Response, next: NextFunction) {
	const taskId = req.locals.id;
	const { status } = req.locals.data as TaskStatusValidationResult;
	const taskService = new TaskService(req.locals.user);

	try {
		await taskService.updateTaskStatus(taskId, status);

		Respond({
			res,
			status: 200,
		});
	} catch (err) {
		if (err instanceof CustomError) {
			return next(err);
		}
		return next(new CustomError(ERRORS.INTERNAL_SERVER_ERROR));
	}
}

async function uploadAttachment(req: Request, res: Response, next: NextFunction) {
	const taskId = req.locals.id;
	const taskService = new TaskService(req.locals.user);

	const fileUploadOptions: SingleFileUploadOptions = {
		field_name: 'file',
		options: {
			fileFilter: ONLY_MEDIA_ALLOWED,
		},
	};
	let uploadedFile;
	try {
		uploadedFile = await FileUpload.SingleFileUpload(req, res, fileUploadOptions);
	} catch (err: unknown) {
		return next(new CustomError(ERRORS.FILE_UPLOAD_ERROR, err));
	}

	try {
		await taskService.uploadAttachment(taskId, uploadedFile.filename);

		Respond({
			res,
			status: 200,
		});
	} catch (err) {
		if (err instanceof CustomError) {
			return next(err);
		}
		return next(new CustomError(ERRORS.INTERNAL_SERVER_ERROR));
	}
}

async function deleteAttachment(req: Request, res: Response, next: NextFunction) {
	const taskId = req.locals.id;
	const attachmentName = req.locals.data as string;
	const taskService = new TaskService(req.locals.user);

	try {
		await taskService.deleteAttachment(taskId, attachmentName);

		const path = __basedir + Path.Misc + attachmentName;
		FileUtils.deleteFile(path);

		Respond({
			res,
			status: 200,
		});
	} catch (err) {
		if (err instanceof CustomError) {
			return next(err);
		}
		return next(new CustomError(ERRORS.INTERNAL_SERVER_ERROR));
	}
}

const Controller = {
	createTask,
	updateTask,
	getTask,
	assignedToMe,
	assignedByMe,
	getNavigationLink,
	getFormData,
	updateFormData,
	assignTask,
	transferTask,
	updateTaskStatus,
	uploadAttachment,
	deleteAttachment,
};

export default Controller;
