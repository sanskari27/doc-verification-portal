import express from 'express';
import SessionRoute from './auth/auth.route';
import TasksRoute from './tasks/tasks.route';
import UsersRoute from './users/users.route';

import { Path } from '../config/const';
import { VerifySession } from '../middleware';
import { RespondFile } from '../utils/ExpressUtils';

const router = express.Router();

// Next routes will be webhooks routes

router.use('/auth', SessionRoute);
router.use('/tasks', VerifySession, TasksRoute);
router.use('/users', VerifySession, UsersRoute);

router.get('/media/:filename', async function (req, res, next) {
	try {
		const path = __basedir + Path.Misc + req.params.filename;
		return RespondFile({
			res,
			filename: req.params.filename,
			filepath: path,
		});
	} catch (err: unknown) {
		return res.status(404).send('File not found');
	}
});

export default router;
