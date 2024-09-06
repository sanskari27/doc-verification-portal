import mongoose from 'mongoose';
import { ContactedPerson, IVerificationForm } from '../types/verificationForm';
import { TaskDB_name } from './Task';

export const ContactedPersonSchema = new mongoose.Schema<ContactedPerson>(
	{
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
	},
	{ _id: false }
);

const VerificationFormSchema = new mongoose.Schema<IVerificationForm>({
	task_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: TaskDB_name,
		required: true,
	},
	applicantName: {
		type: String,
		required: true,
	},
	coApplicantName: {
		type: String,
		default: '',
	},
	dateOfApplication: Date,
	residence: {
		type: String,
		default: '',
	},
	telephone: {
		type: String,
		default: '',
	},
	signedDate: {
		type: Date,
		default: Date.now,
	},
	signedPlace: {
		type: String,
		default: '',
	},
});

export const VerificationFormDB_name = 'VerificationForm';

export default mongoose.model<IVerificationForm>(VerificationFormDB_name, VerificationFormSchema);
