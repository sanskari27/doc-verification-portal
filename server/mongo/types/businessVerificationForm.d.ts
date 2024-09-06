import { Document, Types } from 'mongoose';
import { ContactedPerson } from './verificationForm';

export interface IBusinessVerificationForm extends Document {
	task_id: Types.ObjectId;
	businessDetails: BusinessDetails;
	companyType: 'Proprietorship' | 'Partnership' | 'Private Limited' | 'Public Limited' | 'Others';
	productDetails: string;
	employees: number;
	customersPerDay: number;
	averageMonthlyIncome: number;
	businessBoard: string;
	nameVerifiedBy: 'Receptionist' | 'Security Guard' | 'Colleague' | 'Others';
	officeArea: number;
	premises: 'Owned' | 'Rented' | 'Leased' | 'Shared';
	officeConstruction: 'Pukka' | 'Semi-Pukka' | 'Temporary';
	exteriors: 'Good' | 'Average' | 'Poor';
	interiors: BusinessInteriors;
	locationEase: 'Easy' | 'Difficult' | 'Untraceable';
	businessActivity: 'High' | 'Medium' | 'Low';
	employeeSighted: number;
	customersSighted: number;
	affiliation: string;
	recommended: 'Recommended' | 'Not Recommended';
	remarks: string;
}

export interface BusinessDetails extends ContactedPerson {
	designation: string;
	businessTenure: number;
	visitingCard: boolean;
	companyName: string;
}

export interface BusinessInteriors {
	painted: boolean;
	carpeted: boolean;
	curtains: boolean;
	clean: boolean;
}
