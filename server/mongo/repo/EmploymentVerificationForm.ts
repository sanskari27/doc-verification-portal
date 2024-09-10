import mongoose from 'mongoose';
import {
	EmploymentDetails,
	EmploymentInteriors,
	IEmploymentVerificationForm,
	SalaryDetails,
} from '../types/employmentVerificationForm';
import { TaskDB_name } from './Task';

const EmploymentDetailsSchema = new mongoose.Schema<EmploymentDetails>(
	{
		organizationName: {
			type: String,
			default: '',
		},
		employeesCount: Number,
		branchesCount: Number,
		visitingCard: Boolean,
	},
	{ _id: false }
);

const SalaryDetailsSchema = new mongoose.Schema<SalaryDetails>(
	{
		name: String,
		mode: {
			type: String,
			enum: ['Cash', 'Cheque', 'Bank Transfer', 'Others'],
		},
		bankName: String,
		salary: Number,
		designation: String,
	},
	{ _id: false }
);

const EmploymentInteriorsSchema = new mongoose.Schema<EmploymentInteriors>(
	{
		painted: Boolean,
		carpeted: Boolean,
		curtains: Boolean,
		clean: Boolean,
	},
	{ _id: false }
);

const EmploymentVerificationFormSchema = new mongoose.Schema<IEmploymentVerificationForm>({
	task_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: TaskDB_name,
		required: true,
		unique: true,
	},
	officeAddress: {
		type: String,
		default: '',
	},
	addressConfirmed: {
		type: Boolean,
		default: false,
	},
	designation: {
		type: String,
		default: '',
	},
	dateOfVisit: {
		type: Date,
	},
	employmentDetails: EmploymentDetailsSchema,
	jobType: {
		type: String,
		enum: ['Permanent', 'Probation', 'Contract Worker', 'Temporary', 'Others'],
	},
	workingAs: {
		type: String,
		enum: [
			'Assistant',
			'Clerk',
			'Typist',
			'Stenographer',
			'Skilled Labour',
			'Supervisor',
			'Junior Management',
			'Middle Management',
			'Senior Management',
			'Other',
		],
	},
	jobTransferable: {
		type: Boolean,
		default: false,
	},
	salaryDetails: SalaryDetailsSchema,
	interiors: EmploymentInteriorsSchema,
	recommended: {
		type: String,
		enum: ['Recommended', 'Not Recommended'],
	},
	remarks: {
		type: String,
		default: '',
	},
	officeRemarks: {
		type: String,
		enum: ['Positive', 'Negative'],
	},
});

export const EmploymentVerificationFormDB_name = 'EmploymentVerificationForm';

export default mongoose.model<IEmploymentVerificationForm>(
	EmploymentVerificationFormDB_name,
	EmploymentVerificationFormSchema
);
