import mongoose from 'mongoose';
import { TaskStatus } from '../../src/config/const';
import { ITask } from '../types/task';
import { AccountDB_name } from './Account';
import BankVerificationForm, { BankVerificationFormDB_name } from './BankVerificationForm';
import BusinessVerificationForm from './BusinessVerificationForm';
import EmploymentVerificationForm, {
	EmploymentVerificationFormDB_name,
} from './EmploymentVerificationForm';
import IncomeTaxVerificationForm, {
	IncomeTaxVerificationFormDB_name,
} from './IncomeTaxVerificationForm';
import ResidenceVerificationForm, {
	ResidenceVerificationFormDB_name,
} from './ResidenceVerificationForm';
import TeleVerificationForm, { TeleVerificationFormDB_name } from './TeleVerificationForm';
import VerificationForm from './VerificationForm';

const TaskSchema = new mongoose.Schema<ITask>(
	{
		assignedBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: AccountDB_name,
			required: true,
		},
		agentsInvolved: {
			type: [mongoose.Schema.Types.ObjectId],
			ref: AccountDB_name,
			required: true,
			default: [],
		},
		assignedTo: {
			type: mongoose.Schema.Types.ObjectId,
			ref: AccountDB_name,
			required: true,
		},
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
			ref: BankVerificationFormDB_name,
		},
		teleVerificationId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: TeleVerificationFormDB_name,
		},
		residenceVerificationId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: ResidenceVerificationFormDB_name,
		},
		incomeVerificationId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: IncomeTaxVerificationFormDB_name,
		},
		bankVerificationId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: BankVerificationFormDB_name,
		},
		employmentVerificationId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: EmploymentVerificationFormDB_name,
		},
		businessVerificationId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: BankVerificationFormDB_name,
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
		})
	)._id;
	this.residenceVerificationId = (await ResidenceVerificationForm.create({}))._id;
	this.teleVerificationId = (await TeleVerificationForm.create({}))._id;
	this.bankVerificationId = (await BankVerificationForm.create({}))._id;
	if (this.verificationType === 'business') {
		this.businessVerificationId = (await BusinessVerificationForm.create({}))._id;
		this.incomeVerificationId = (await IncomeTaxVerificationForm.create({}))._id;
	} else {
		this.employmentVerificationId = (await EmploymentVerificationForm.create({}))._id;
		this.incomeVerificationId = (await IncomeTaxVerificationForm.create({}))._id;
	}
});

export const TaskDB_name = 'Task';

export default mongoose.model<ITask>(TaskDB_name, TaskSchema);
