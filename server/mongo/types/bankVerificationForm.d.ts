import { Document } from 'mongoose';

export interface IBankVerificationForm extends Document {
	applicant: BankDetails;
	coApplicant: BankDetails;
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

export interface BusinessInteriors {
	painted: boolean;
	carpeted: boolean;
	curtains: boolean;
	clean: boolean;
}
