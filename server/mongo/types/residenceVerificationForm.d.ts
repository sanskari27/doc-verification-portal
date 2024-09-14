import { Document, Types } from 'mongoose';

export interface IResidenceVerificationForm extends Document {
	task_id: Types.ObjectId;
	addressConfirmed: boolean;
	dateOfVisit: Date;

	residenceContacted: ContactedPerson;
	residenceType:
		| 'Self owned'
		| 'Owned by relatives'
		| 'Rented'
		| 'Paying Guest'
		| 'Owned by parents'
		| 'Owned by friends'
		| 'Company Accommodation'
		| 'Lodging';

	maritalStatus: MaritalStatus;
	vehicleDetails: VehicleDetails;
	financeDetails: FinanceDetails;
	nature: 'Polite' | 'Rude' | 'Aggressive' | 'Cooperative' | 'Uncooperative';
	neighbourhood: 'Positve' | 'Negative' | 'Neutral';
	neighbourhoodContacted: string[];

	interiors: ResidenceInteriors;
	exterior: ResidenceExteriors;
	carpetArea: number;
	politicalPictures: string;
	livingStandard: 'High' | 'Medium' | 'Low';
	remarks: 'Positive' | 'Negative';
	neighbourhoodObservations: NeighborhoodObservations;
}

export interface ContactedPerson {
	name: string;
	dob: string;
	relationship: string;
	residingFor: string;
	education: string;
}

export interface MaritalStatus {
	status: 'Married' | 'Unmarried' | 'Separated' | 'Widowed';
	members: number;
	workingMembers: number;
	dependents: number;
	children: number;
	spouseWorking: boolean;
	spouseEmploymentDetails: string;
}

export interface VehicleDetails {
	twoWheeler: boolean;
	car: boolean;
	other: boolean;
}

export interface FinanceDetails {
	financerName: string;
	loanNo: string;
	loanOs: string;
	emi: number;
}

export interface ResidenceInteriors {
	cemented: 'RCC Cemented' | 'Non RCC' | '';
	painted: boolean;
	carpeted: boolean;
	curtains: boolean;
	sofa: boolean;
	venetianBlinds: boolean;
}

export interface ResidenceExteriors {
	overallCondition: 'Good' | 'Bad' | 'Average' | 'Excellent';
	television: boolean;
	refrigerator: boolean;
	musicSystem: boolean;
	twoWheeler: boolean;
	car: boolean;
	airConditioner: boolean;
}

export interface NeighborhoodObservations {
	staysInResidence: boolean;
	availability: string;
	averageAge: number;
	noOfMembers: number;
	remarks: 'Positive' | 'Negative';
}
