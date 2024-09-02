import express from 'express';
import SessionRoute from './auth/auth.route';
import UsersRoute from './users/users.route';

import FileUpload, { ONLY_MEDIA_ALLOWED, SingleFileUploadOptions } from '../config/FileUpload';
import { CustomError, ERRORS } from '../errors';
import { VerifySession } from '../middleware';
import SocketServer from '../socket';
import { Respond, generateRandomID } from '../utils/ExpressUtils';

const router = express.Router();

// Next routes will be webhooks routes

router.use('/sessions', SessionRoute);
router.use('/users', VerifySession, UsersRoute);

router
	.route('/conversation-message-key')
	.all(VerifySession)
	.post(async function (req, res, next) {
		const key = generateRandomID();

		SocketServer.getInstance().addConversationKey(key, req.locals.serviceUser.userId.toString());
		Respond({
			res,
			status: 200,
			data: {
				key,
			},
		});
	});

router.post('/upload-media', async function (req, res, next) {
	const fileUploadOptions: SingleFileUploadOptions = {
		field_name: 'file',
		options: {
			fileFilter: ONLY_MEDIA_ALLOWED,
		},
	};

	try {
		const uploadedFile = await FileUpload.SingleFileUpload(req, res, fileUploadOptions);
		return Respond({
			res,
			status: 200,
			data: {
				name: uploadedFile.filename,
			},
		});
	} catch (err: unknown) {
		return next(new CustomError(ERRORS.FILE_UPLOAD_ERROR, err));
	}
});

export default router;
