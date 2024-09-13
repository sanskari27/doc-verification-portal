import mongoose from 'mongoose';
import {
	BusinessDetails,
	Guarantor,
	ITeleVerificationForm,
	TeleCalling,
	TeleCallingLog,
} from '../types/teleVerificationForm';
import { ContactedPersonSchema } from './VerificationForm';

const BusinessDetailsSchema = new mongoose.Schema<BusinessDetails>(
	{
		name: {
			type: String,
			default: '',
		},
		nature: {
			type: String,
			default: '',
		},
		address: {
			type: String,
			default: '',
		},
		activeSince: {
			type: String,
			default: '',
		},
		designation: {
			type: String,
			default: '',
		},
		department: {
			type: String,
			default: '',
		},
	},
	{ _id: false }
);

const TeleCallingLogSchema = new mongoose.Schema<TeleCallingLog>({
	contactedAt: {
		type: Date,
	},
	outcome: {
		type: String,
		default: '',
	},
});

const TeleCallingSchema = new mongoose.Schema<TeleCalling>({
	teleCallingResidenceAttempt1: TeleCallingLogSchema,
	teleCallingResidenceAttempt2: TeleCallingLogSchema,
	teleCallingResidenceAttempt3: TeleCallingLogSchema,
	teleCallingOfficeAttempt1: TeleCallingLogSchema,
	teleCallingOfficeAttempt2: TeleCallingLogSchema,
	teleCallingOfficeAttempt3: TeleCallingLogSchema,
});

const GuarantorSchema = new mongoose.Schema<Guarantor>({
	name: {
		type: String,
		default: '',
	},
	telephone: {
		type: String,
		default: '',
	},
	relationship: {
		type: String,
		default: '',
	},
	knownFor: {
		type: String,
		default: '',
	},
	employmentDetails: {
		type: String,
		default: '',
	},
	otherLoans: {
		type: String,
		default: '',
	},
	awareOfLiabilities: {
		type: String,
		default: '',
	},
	awareOfApplicant: {
		type: String,
		default: '',
	},
	loanQuantum: {
		type: String,
		default: '',
	},
});

const TeleVerificationFormSchema = new mongoose.Schema<ITeleVerificationForm>({
	task_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Task',
		required: true,
		unique: true,
	},
	residenceContacted: ContactedPersonSchema,
	officeContacted: ContactedPersonSchema,
	businessDetails: BusinessDetailsSchema,

	residenceTeleCalling: TeleCallingSchema,
	guarantor: GuarantorSchema,
	reference1: ContactedPersonSchema,
	reference2: ContactedPersonSchema,
	guarantorTeleCalling: TeleCallingSchema,

	outcome: {
		type: String,
		default: '',
	},
	remarks: {
		type: String,
		default: '',
	},
	verificationResult: {
		type: String,
		enum: ['Positive', 'Negative'],
	},
});

export const TeleVerificationFormDB_name = 'TeleVerificationForm';

export default mongoose.model<ITeleVerificationForm>(
	TeleVerificationFormDB_name,
	TeleVerificationFormSchema
);
