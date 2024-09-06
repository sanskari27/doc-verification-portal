import { Document, Types } from 'mongoose';
import { TaskStatus } from '../../src/config/const';

export interface ITask extends Document {
	_id: Types.ObjectId;
	assignedBy: Types.ObjectId;
	agentsInvolved: Types.ObjectId[];
	assignedTo: Types.ObjectId;
	dueDate: Date;
	completedAt: Date | null;
	status: TaskStatus;
	priority: 'low' | 'medium' | 'high';
	title: string;
	description: string;

	verificationType: 'business' | 'non-business' | 'nri';
	applicantName: string;
	verificationFormId: Types.ObjectId;
	teleVerificationId: Types.ObjectId;
	residenceVerificationId: Types.ObjectId;
	incomeVerificationId: Types.ObjectId;
	bankVerificationId: Types.ObjectId;
	employmentVerificationId: Types.ObjectId;
	businessVerificationId: Types.ObjectId;
}
