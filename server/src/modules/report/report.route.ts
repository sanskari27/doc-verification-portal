import express from 'express';
import { UserLevel } from '../../config/const';
import { VerifyMinLevel } from '../../middleware';
import Controller from './report.controller';
import { FetchQueryValidator } from './report.validator';

const router = express.Router();

router
	.route('/previous-records-summary')
	.all(VerifyMinLevel(UserLevel.Admin))
	.get(Controller.previousRecordsSummary);

router

router
	.route('/summary')
	.all(VerifyMinLevel(UserLevel.Admin))
	.get(Controller.summary);

router
	.route('/monthly-report')
	.all(VerifyMinLevel(UserLevel.Admin))
	.get(Controller.monthlyReport);

router
	.route('/month-report')
	.all(VerifyMinLevel(UserLevel.Admin))
	.get(Controller.monthReport);

router
	.route('/city-records-summary')
	.all(VerifyMinLevel(UserLevel.Admin))
	.get(Controller.cityBasedSummary);

router.route('/').all(VerifyMinLevel(UserLevel.Admin)).get(FetchQueryValidator, Controller.report);

export default router;
