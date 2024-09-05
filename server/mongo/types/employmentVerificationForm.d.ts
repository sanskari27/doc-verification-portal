import { Document } from 'mongoose';
import { ContactedPerson } from './verificationForm';

export interface IEmploymentVerificationForm extends Document {
	officeAddress: string;
	addressConfirmed: boolean;
	designation: string;
	dateOfVisit: Date;

	employmentDetails: EmploymentDetails;
	jobType: 'Permanent' | 'Probation' | 'Contract Worker' | 'Temporary' | 'Others';
	workingAs:
		| 'Assistant'
		| 'Clerk'
		| 'Typist'
		| 'Stenographer'
		| 'Skilled Labour'
		| 'Supervisor'
		| 'Junior Management'
		| 'Middle Management'
		| 'Senior Management'
		| 'Other';
	jobTransferable: boolean;
	salaryDetails: SalaryDetails;

	recommended: 'Recommended' | 'Not Recommended';
	remarks: string;
	officeRemarks: "Positive" | "Negative";
}

export interface EmploymentDetails extends ContactedPerson {
	organizationName: string;
	employeesCount: number;
	branchesCount: number;
	visitingCard: boolean;
}

export interface SalaryDetails {
	name: string;
	mode: 'Cash' | 'Cheque' | 'Bank Transfer' | 'Others';
	bankName: string;
	salary: number;
	designation: string;
}

export interface EmploymentInteriors {
	painted: boolean;
	carpeted: boolean;
	curtains: boolean;
	clean: boolean;
}
