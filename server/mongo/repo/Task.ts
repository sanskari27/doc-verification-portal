import mongoose from 'mongoose';
import { TaskStatus } from '../../src/config/const';
import { ITask } from '../types/task';
import BankVerificationForm from './BankVerificationForm';
import BusinessVerificationForm from './BusinessVerificationForm';
import EmploymentVerificationForm from './EmploymentVerificationForm';
import IncomeTaxVerificationForm from './IncomeTaxVerificationForm';
import ResidenceVerificationForm from './ResidenceVerificationForm';
import TeleVerificationForm from './TeleVerificationForm';
import VerificationForm from './VerificationForm';

const TaskSchema = new mongoose.Schema<ITask>(
	{
		dueDate: {
			type: Date,
			required: true,
			default: Date.now,
		},
		completedAt: {
			type: Date,
			default: null,
		},
		status: {
			type: String,
			enum: Object.values(TaskStatus),
			default: TaskStatus.Pending,
		},
		priority: {
			type: String,
			enum: ['low', 'medium', 'high'],
			required: true,
			default: 'low',
		},
		title: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			default: '',
		},

		verificationType: {
			type: String,
			enum: ['business', 'non-business', 'nri'],
			required: true,
		},
		applicantName: {
			type: String,
			required: true,
		},
		verificationFormId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'BankVerificationForm',
		},
		teleVerificationId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'TeleVerificationForm',
		},
		residenceVerificationId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'ResidenceVerificationForm',
		},
		incomeVerificationId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'IncomeTaxVerificationForm',
		},
		bankVerificationId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'BankVerificationForm',
		},
		employmentVerificationId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'EmploymentVerificationForm',
		},
		businessVerificationId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'BankVerificationForm',
		},
	},
	{ timestamps: true }
);

TaskSchema.index({
	verificationFormId: 1,
	teleVerificationId: 1,
	residenceVerificationId: 1,
	incomeVerificationId: 1,
	bankVerificationId: 1,
	employmentVerificationId: 1,
	businessVerificationId: 1,
});

TaskSchema.pre('save', async function (next) {
	if (!this.isNew) return next();
	this.verificationFormId = (
		await VerificationForm.create({
			applicantName: this.applicantName || '',
			task_id: this._id,
		})
	)._id;
	this.residenceVerificationId = (
		await ResidenceVerificationForm.create({
			task_id: this._id,
		})
	)._id;
	this.teleVerificationId = (
		await TeleVerificationForm.create({
			task_id: this._id,
		})
	)._id;
	this.bankVerificationId = (
		await BankVerificationForm.create({
			task_id: this._id,
		})
	)._id;
	if (this.verificationType === 'business') {
		this.businessVerificationId = (
			await BusinessVerificationForm.create({
				task_id: this._id,
			})
		)._id;
		this.incomeVerificationId = (
			await IncomeTaxVerificationForm.create({
				task_id: this._id,
			})
		)._id;
	} else {
		this.employmentVerificationId = (
			await EmploymentVerificationForm.create({
				task_id: this._id,
			})
		)._id;
		this.incomeVerificationId = (
			await IncomeTaxVerificationForm.create({
				task_id: this._id,
			})
		)._id;
	}
});

export const TaskDB_name = 'Task';

export default mongoose.model<ITask>(TaskDB_name, TaskSchema);
