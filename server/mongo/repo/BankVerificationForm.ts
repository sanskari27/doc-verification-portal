import mongoose from 'mongoose';
import { BankDetails, IBankVerificationForm } from '../types/bankVerificationForm';

const BankDetailsSchema = new mongoose.Schema<BankDetails>(
	{
		name: String,
		bankName: String,
		branch: String,
		accountNo: String,
		status: {
			type: String,
			enum: ['Positive', 'Negative'],
		},
		otherDebits: String,
		cd: String,
		remarks: {
			type: String,
			enum: ['Recommended', 'Not Recommended'],
		},
	},
	{ _id: false }
);

const BankVerificationFormSchema = new mongoose.Schema<IBankVerificationForm>({
	applicant: BankDetailsSchema,
	coApplicant: BankDetailsSchema,
});
export const BankVerificationFormDB_name = 'BankVerificationForm';

export default mongoose.model<IBankVerificationForm>(
	BankVerificationFormDB_name,
	BankVerificationFormSchema
);
