import { Document, Types } from 'mongoose';
import { ContactedPerson } from './verificationForm';

export interface ITeleVerificationForm extends Document {
	task_id: Types.ObjectId;
	residenceContacted: ContactedPerson;
	officeContacted: ContactedPerson;
	businessDetails: BusinessDetails;

	residenceTeleCalling: TeleCalling;

	guarantor: Guarantor;
	reference1: ContactedPerson;
	reference2: ContactedPerson;
	guarantorTeleCalling: TeleCalling;
	outcome: string;
	remarks: string;
	verificationResult: 'Positive' | 'Negative';
}

export interface BusinessDetails {
	name: string;
	nature: string;
	address: string;
	activeSince: string;
	designation: string;
	department: string;
}

export interface TeleCallingLog {
	contactedAt: Date;
	outcome: string;
}

export interface Guarantor extends ContactedPerson {
	employmentDetails: string;
	otherLoans: string;
	awareOfLiabilities: string;
	awareOfApplicant: string;
	loanQuantum: string;
}

export interface TeleCalling {
	teleCallingResidenceAttempt1: TeleCallingLog;
	teleCallingResidenceAttempt2: TeleCallingLog;
	teleCallingResidenceAttempt3: TeleCallingLog;
	teleCallingOfficeAttempt1: TeleCallingLog;
	teleCallingOfficeAttempt2: TeleCallingLog;
	teleCallingOfficeAttempt3: TeleCallingLog;
}
