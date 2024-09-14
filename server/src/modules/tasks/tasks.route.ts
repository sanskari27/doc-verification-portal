import express from 'express';
import { UserLevel } from '../../config/const';
import { IDValidator, VerifyMinLevel } from '../../middleware';
import Controller from './tasks.controller';
import {
	AssignValidator,
	CreateTaskValidator,
	NameValidator,
	TaskStatusValidator,
	UpdateTaskValidator,
	VerificationFormDataValidator,
} from './tasks.validator';

const router = express.Router();

router.route('/assigned-to-me').get(Controller.assignedToMe);
router.route('/assigned-by-me').get(Controller.assignedByMe);

router
	.route('/:id/attachment')
	.post(IDValidator, Controller.uploadAttachment)
	.delete(IDValidator, NameValidator, Controller.deleteAttachment);

router.route('/:id/assign').post(IDValidator, AssignValidator, Controller.assignTask);
router.route('/:id/transfer').post(IDValidator, AssignValidator, Controller.transferTask);

router.route('/:id/status').post(IDValidator, TaskStatusValidator, Controller.updateTaskStatus);

router
	.route('/:id/verification-forms')
	.get(IDValidator, Controller.getFormData)
	.post(
		IDValidator,
		VerifyMinLevel(UserLevel.Admin),
		VerificationFormDataValidator,
		Controller.updateFormData
	);

router.route('/:id/navigation-link').get(IDValidator, Controller.getNavigationLink);

router
	.route('/:id')
	.get(IDValidator, Controller.getTask)
	.patch(VerifyMinLevel(UserLevel.Admin), IDValidator, UpdateTaskValidator, Controller.updateTask);

router.route('/').post(VerifyMinLevel(UserLevel.Admin), CreateTaskValidator, Controller.createTask);

export default router;
