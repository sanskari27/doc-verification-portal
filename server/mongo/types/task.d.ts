import { Document, Types } from 'mongoose';
import { TaskStatus } from '../../src/config/const';

export interface ITask extends Document {
	_id: Types.ObjectId;
	dueDate: Date;
	completedAt: Date | null;
	status: TaskStatus;
	priority: 'low' | 'medium' | 'high';
	title: string;
	description: string;

	verificationType: 'business' | 'non-business' | 'nri';
	applicantName: string;
	applicationNo: string;
	city: string;

	kyc1: Types.ObjectId;
	kyc2: Types.ObjectId;
	kyc3: Types.ObjectId;
	kyc4: Types.ObjectId;
	kyc5: Types.ObjectId;

	verificationFormId: Types.ObjectId;
	teleVerificationId: Types.ObjectId;
	residenceVerificationId: Types.ObjectId;
	incomeVerificationId: Types.ObjectId;
	bankVerificationId: Types.ObjectId;
	employmentVerificationId: Types.ObjectId;
	businessVerificationId: Types.ObjectId;

	attachments: string[];

	createdAt: Date;
}
