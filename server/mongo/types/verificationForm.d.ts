import { Document } from 'mongoose';

export interface IVerificationForm extends Document {
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
