import { Document, Types } from 'mongoose';

export interface IIncomeTaxVerificationForm extends Document {
	task_id: Types.ObjectId;
	panNo: string;
	financialRecords: IncomeTaxFinancialYear[];
	remarks: 'Positive' | 'Negative';
}

export interface IncomeTaxFinancialYear {
	financialYear: string;
	incomeTaxRecord: IncomeTaxRecord;
	customerRecord: IncomeTaxRecord;
}

export interface IncomeTaxRecord {
	ward: string;
	fillingDate: string;
	salary: number;
	house: number;
	business: number;
	capitalGain: number;
	otherSource: number;
	grossTotal: number;
	deduction: number;
	taxPaid: number;
	netIncome: number;
	remarks: 'Positive' | 'Negative';
}
