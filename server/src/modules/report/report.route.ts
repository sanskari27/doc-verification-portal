import express from 'express';
import { UserLevel } from '../../config/const';
import { VerifyMinLevel } from '../../middleware';
import Controller from './report.controller';
import { FetchQueryValidator } from './report.validator';

const router = express.Router();

router.route('/').all(VerifyMinLevel(UserLevel.Admin)).get(FetchQueryValidator, Controller.report);

export default router;
