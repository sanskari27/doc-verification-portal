import mongoose from 'mongoose';
import {
	FinanceDetails,
	IResidenceVerificationForm,
	NeighbourhoodObservations,
	ResidenceExteriors,
	ResidenceInteriors,
	VehicleDetails,
} from '../types/residenceVerificationForm';
import { ContactedPersonSchema } from './VerificationForm';

const VehicleDetailsSchema = new mongoose.Schema<VehicleDetails>(
	{
		twoWheeler: Boolean,
		car: Boolean,
		other: Boolean,
	},
	{ _id: false }
);

const FinanceDetailsSchema = new mongoose.Schema<FinanceDetails>(
	{
		financerName: String,
		loanNo: String,
		loanOs: String,
		emi: Number,
	},
	{ _id: false }
);

const ResidenceInteriorsSchema = new mongoose.Schema<ResidenceInteriors>(
	{
		cemented: {
			type: String,
			enum: ['RCC Cemented', 'Non RCC', ''],
		},
		painted: Boolean,
		carpeted: Boolean,
		curtains: Boolean,
		sofa: Boolean,
		venetianBlinds: Boolean,
	},
	{ _id: false }
);

const ResidenceExteriorsSchema = new mongoose.Schema<ResidenceExteriors>(
	{
		overallCondition: {
			type: String,
			enum: ['Good', 'Bad', 'Average', 'Excellent'],
		},
		television: Boolean,
		refrigerator: Boolean,
		musicSystem: Boolean,
		twoWheeler: Boolean,
		car: Boolean,
		airConditioner: Boolean,
	},
	{ _id: false }
);

const NeighbourhoodObservationsSchema = new mongoose.Schema<NeighbourhoodObservations>(
	{
		staysInResidence: Boolean,
		availability: String,
		averageAge: Number,
		noOfMembers: Number,
		remarks: {
			type: String,
			enum: ['Positive', 'Negative'],
		},
	},
	{ _id: false }
);

const ResidenceVerificationFormSchema = new mongoose.Schema<IResidenceVerificationForm>({
	task_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Task',
		required: true,
		unique: true,
	},
	addressConfirmed: {
		type: Boolean,
		default: true,
	},
	dateOfVisit: Date,
	residenceContacted: ContactedPersonSchema,
	residenceType: {
		type: String,
		enum: [
			'Self owned',
			'Owned by relatives',
			'Rented',
			'Paying Guest',
			'Owned by parents',
			'Owned by friends',
			'Company Accommodation',
			'Lodging',
		],
	},
	maritalStatus: {
		status: {
			type: String,
			enum: ['Married', 'Unmarried', 'Separated', 'Widowed'],
		},
		members: Number,
		workingMembers: Number,
		dependents: Number,
		children: Number,
		spouseWorking: Boolean,
		spouseEmploymentDetails: String,
	},
	vehicleDetails: VehicleDetailsSchema,
	financeDetails: FinanceDetailsSchema,
	nature: {
		type: String,
		enum: ['Polite', 'Rude', 'Aggressive', 'Cooperative', 'Uncooperative'],
	},
	neighbourhood: {
		type: String,
		enum: ['Positve', 'Negative', 'Neutral'],
	},
	neighbourhoodContacted: {
		type: [String],
	},
	interiors: ResidenceInteriorsSchema,
	exterior: ResidenceExteriorsSchema,
	carpetArea: Number,
	politicalPictures: String,
	livingStandard: {
		type: String,
		enum: ['High', 'Medium', 'Low'],
	},
	remarks: {
		type: String,
		enum: ['Positive', 'Negative'],
	},
	neighbourhoodObservations: NeighbourhoodObservationsSchema,
});

export const ResidenceVerificationFormDB_name = 'ResidenceVerificationForm';

export default mongoose.model<IResidenceVerificationForm>(
	ResidenceVerificationFormDB_name,
	ResidenceVerificationFormSchema
);
