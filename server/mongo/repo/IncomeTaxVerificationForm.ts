import mongoose from 'mongoose';
import {
	IIncomeTaxVerificationForm,
	IncomeTaxFinancialYear,
	IncomeTaxRecord,
} from '../types/incomeTaxVerificationForm';
import { TaskDB_name } from './Task';

const IncomeTaxRecordSchema = new mongoose.Schema<IncomeTaxRecord>(
	{
		ward: String,
		fillingDate: String,
		salary: Number,
		house: Number,
		business: Number,
		capitalGain: Number,
		otherSource: Number,
		grossTotal: Number,
		deduction: Number,
		taxPaid: Number,
		netIncome: Number,
		remarks: {
			type: String,
			enum: ['Positive', 'Negative'],
		},
	},

	{ _id: false }
);

const IncomeTaxFinancialYearSchema = new mongoose.Schema<IncomeTaxFinancialYear>(
	{
		financialYear: String,
		incomeTaxRecord: IncomeTaxRecordSchema,
		customerRecord: IncomeTaxRecordSchema,
	},
	{ _id: false }
);

const IncomeTaxVerificationFormSchema = new mongoose.Schema<IIncomeTaxVerificationForm>({
	task_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: TaskDB_name,
		required: true,
	},
	panNo: {
		type: String,
		required: true,
	},
	financialRecords: {
		type: [IncomeTaxFinancialYearSchema],
		default: [],
	},
});

export const IncomeTaxVerificationFormDB_name = 'IncomeTaxVerificationForm';

export default mongoose.model<IIncomeTaxVerificationForm>(
	IncomeTaxVerificationFormDB_name,
	IncomeTaxVerificationFormSchema
);
