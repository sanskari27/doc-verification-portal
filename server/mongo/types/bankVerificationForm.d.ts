import { Document, Types } from 'mongoose';

export interface IBankVerificationForm extends Document {
	task_id: Types.ObjectId;
	applicant: BankDetails;
	coApplicant: BankDetails;
	remarks: 'Recommended' | 'Not Recommended';
}

export interface BankDetails {
	name: string;
	bankName: string;
	branch: string;
	accountNo: string;
	status: 'Positive' | 'Negative';
	otherDebits: string;
	cd: string;
	remarks: 'Recommended' | 'Not Recommended';
}
