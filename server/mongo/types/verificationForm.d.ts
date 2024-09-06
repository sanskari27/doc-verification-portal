import { Document, Types } from 'mongoose';

export interface IVerificationForm extends Document {
	task_id: Types.ObjectId;
	applicationNo: string;
	coApplicantName: string;
	dateOfApplication: Date;
	applicantName: string;
	residence: string;
	telephone: string;
	signedDate: Date;
	signedPlace: string;
}

export interface ContactedPerson {
	name: string;
	telephone: string;
	relationship: string;
	knownFor: string;
}
