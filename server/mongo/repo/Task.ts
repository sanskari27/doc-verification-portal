import mongoose from 'mongoose';
import { TaskStatus } from '../../src/config/const';
import { ITask } from '../types/task';
import { AccountDB_name } from './Account';
import { BankVerificationFormDB_name } from './BankVerificationForm';
import { EmploymentVerificationFormDB_name } from './EmploymentVerificationForm';
import { IncomeTaxVerificationFormDB_name } from './IncomeTaxVerificationForm';
import { ResidenceVerificationFormDB_name } from './ResidenceVerificationForm';
import { TeleVerificationFormDB_name } from './TeleVerificationForm';

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
export const TaskDB_name = 'Task';

export default mongoose.model<ITask>(TaskDB_name, TaskSchema);
