import mongoose from 'mongoose';
export {
	AccountDB,
	BankVerificationFormDB,
	BusinessVerificationFormDB,
	EmploymentVerificationFormDB,
	IncomeVerificationFormDB,
	ResidenceVerificationFormDB,
	SessionDB,
	StorageDB,
	TaskDB,
	TaskManagerDB,
	TeleVerificationFormDB,
	VerificationFormDB,
} from './repo';

export type {
	BankDetails,
	BusinessDetails,
	BusinessInteriors,
	ContactedPerson,
	EmploymentDetails,
	EmploymentInteriors,
	FinanceDetails,
	Guarantor,
	IAccount,
	IBankVerificationForm,
	IBusinessVerificationForm,
	IEmploymentVerificationForm,
	IIncomeTaxVerificationForm,
	IResidenceVerificationForm,
	ISession,
	IStorage,
	ITask,
	ITaskManager,
	ITeleVerificationForm,
	IVerificationForm,
	IncomeTaxFinancialYear,
	IncomeTaxRecord,
	MaritalStatus,
	NeighborhoodObservations,
	ResidenceExteriors,
	ResidenceInteriors,
	SalaryDetails,
	TeleCalling,
	TeleCallingLog,
} from './types';

export default function connectDB(database_url: string) {
	return new Promise((resolve, reject) => {
		mongoose.set('strict', false);
		mongoose.set('strictQuery', false);
		mongoose.set('strictPopulate', false);
		mongoose
			.connect(database_url)
			.then(() => {
				resolve('Successfully connected to database');
			})
			.catch((error) => {
				reject(error);
			});
	});
}
