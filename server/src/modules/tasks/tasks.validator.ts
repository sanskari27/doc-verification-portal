import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';
import { z } from 'zod';
import {
	IBankVerificationForm,
	IBusinessVerificationForm,
	IEmploymentVerificationForm,
	IIncomeTaxVerificationForm,
	IResidenceVerificationForm,
	ITeleVerificationForm,
	IVerificationForm,
} from '../../../mongo';
import { TaskStatus } from '../../config/const';
import { CustomError } from '../../errors';
import DateUtils from '../../utils/DateUtils';
import { idSchema } from '../../utils/schema';

export type CreateTaskValidationResult = {
	applicantName: string;
	assignedTo: Types.ObjectId;
	dueDate: Date;
	priority: 'low' | 'medium' | 'high';
	verificationType: 'nri' | 'business' | 'non-business';
	title: string;
	description?: string | undefined;
};

export type UpdateTaskValidationResult = {
	dueDate?: Date;
	priority?: 'low' | 'medium' | 'high';
	title?: string;
	description?: string;
};

export type FetchQueryType = {
	priority?: 'low' | 'medium' | 'high';
	status: TaskStatus;
	date_range?: {
		start: Date;
		end: Date;
	};
};

export type AssignValidationResult = {
	agentId: Types.ObjectId;
};

export type AssignKYCValidationResult = {
	agentId: Types.ObjectId;
	reKyc: boolean;
};

export type TaskStatusValidationResult = {
	status: TaskStatus;
};

export type VerificationDataResult =
	| (IBankVerificationForm & {
			type: 'bank-verification';
	  })
	| (IBusinessVerificationForm & {
			type: 'business-verification';
	  })
	| (IEmploymentVerificationForm & {
			type: 'employment-verification';
	  })
	| (IIncomeTaxVerificationForm & {
			type: 'income-tax-verification';
	  })
	| (IResidenceVerificationForm & {
			type: 'residence-verification';
	  })
	| (ITeleVerificationForm & {
			type: 'tele-verification';
	  })
	| (IVerificationForm & {
			type: 'verification-form';
	  });

export async function CreateTaskValidator(req: Request, res: Response, next: NextFunction) {
	const reqValidator = z.object({
		applicantName: z.string().trim().min(1),
		assignedTo: idSchema,
		dueDate: z
			.string()
			.trim()
			.transform((val) => DateUtils.getMoment(val).toDate()),
		priority: z.enum(['low', 'medium', 'high']),
		verificationType: z.enum(['nri', 'business', 'non-business']),
		title: z.string().trim().min(1),
		description: z.string().trim().optional(),
	});

	const reqValidatorResult = reqValidator.safeParse(req.body);

	if (reqValidatorResult.success) {
		req.locals.data = reqValidatorResult.data;
		return next();
	}

	return next(
		new CustomError({
			STATUS: 400,
			TITLE: 'INVALID_FIELDS',
			MESSAGE: "Invalid fields in the request's body.",
			OBJECT: reqValidatorResult.error.flatten(),
		})
	);
}

export async function UpdateTaskValidator(req: Request, res: Response, next: NextFunction) {
	const reqValidator = z.object({
		dueDate: z
			.string()
			.trim()
			.transform((val) => DateUtils.getMoment(val).toDate())
			.optional(),

		priority: z.enum(['low', 'medium', 'high']).optional(),
		title: z.string().trim().min(1).optional(),
		description: z.string().trim().optional(),
	});

	const reqValidatorResult = reqValidator.safeParse(req.body);

	if (reqValidatorResult.success) {
		req.locals.data = reqValidatorResult.data;
		return next();
	}

	return next(
		new CustomError({
			STATUS: 400,
			TITLE: 'INVALID_FIELDS',
			MESSAGE: "Invalid fields in the request's body.",
			OBJECT: reqValidatorResult.error.flatten(),
		})
	);
}

const statusValidator = z.enum([
	TaskStatus.Pending,
	TaskStatus.InProgress,
	TaskStatus.Paused,
	TaskStatus.AcceptedUnderReview,
	TaskStatus.RejectedUnderReview,
	TaskStatus.Completed,
	TaskStatus.Rejected,
]);

export function FetchQueryValidator(req: Request, res: Response, next: NextFunction) {
	const reqValidator = z
		.object({
			start_date: z
				.string()
				.transform((val) => DateUtils.getMoment(val).startOf('day').toDate())
				.optional(),
			end_date: z
				.string()
				.transform((val) => DateUtils.getMoment(val).endOf('day').toDate())
				.optional(),

			priority: z.enum(['low', 'medium', 'high']).optional(),
			status: statusValidator.optional(),
		})
		.refine((value) => {
			if (!value.start_date && value.end_date) return false;
			else if (value.start_date && !value.end_date) return false;
			else if (value.start_date && value.end_date) {
				if (DateUtils.getMoment(value.start_date).isAfter(DateUtils.getMoment(value.end_date)))
					return false;
			}
			return true;
		});

	const reqValidatorResult = reqValidator.safeParse(req.query);

	if (reqValidatorResult.success) {
		const data = reqValidatorResult.data;
		req.locals.query = {
			...data,
			...(data.start_date &&
				data.end_date && {
					date_range: {
						start: data.start_date,
						end: data.end_date,
					},
				}),
		};
		return next();
	}

	return next(
		new CustomError({
			STATUS: 400,
			TITLE: 'INVALID_FIELDS',
			MESSAGE: "Invalid fields in the request's query.",
			OBJECT: reqValidatorResult.error.flatten(),
		})
	);
}

export function AssignValidator(req: Request, res: Response, next: NextFunction) {
	const reqValidator = z.object({
		agentId: idSchema,
	});

	const reqValidatorResult = reqValidator.safeParse(req.body);

	if (reqValidatorResult.success) {
		req.locals.data = reqValidatorResult.data;
		return next();
	}

	return next(
		new CustomError({
			STATUS: 400,
			TITLE: 'INVALID_FIELDS',
			MESSAGE: "Invalid fields in the request's body.",
			OBJECT: reqValidatorResult.error.flatten(),
		})
	);
}

export function AssignKYCValidator(req: Request, res: Response, next: NextFunction) {
	const reqValidator = z.object({
		agentId: idSchema,
		reKyc: z.boolean().optional(),
	});

	const reqValidatorResult = reqValidator.safeParse(req.body);

	if (reqValidatorResult.success) {
		req.locals.data = reqValidatorResult.data;
		return next();
	}

	return next(
		new CustomError({
			STATUS: 400,
			TITLE: 'INVALID_FIELDS',
			MESSAGE: "Invalid fields in the request's body.",
			OBJECT: reqValidatorResult.error.flatten(),
		})
	);
}

export function TaskStatusValidator(req: Request, res: Response, next: NextFunction) {
	const reqValidator = z.object({
		status: statusValidator.optional(),
	});

	const reqValidatorResult = reqValidator.safeParse(req.body);

	if (reqValidatorResult.success) {
		req.locals.data = reqValidatorResult.data;
		return next();
	}

	return next(
		new CustomError({
			STATUS: 400,
			TITLE: 'INVALID_FIELDS',
			MESSAGE: "Invalid fields in the request's body.",
			OBJECT: reqValidatorResult.error.flatten(),
		})
	);
}

export function NameValidator(req: Request, res: Response, next: NextFunction) {
	const reqValidator = z.object({
		name: z.string().trim().min(1),
	});

	const reqValidatorResult = reqValidator.safeParse(req.body);

	if (reqValidatorResult.success) {
		req.locals.data = reqValidatorResult.data.name;
		return next();
	}

	return next(
		new CustomError({
			STATUS: 400,
			TITLE: 'INVALID_FIELDS',
			MESSAGE: "Invalid fields in the request's body.",
			OBJECT: reqValidatorResult.error.flatten(),
		})
	);
}

export function VerificationFormDataValidator(req: Request, res: Response, next: NextFunction) {
	const bankDetails = z.object({
		name: z.string().trim().default(''),
		bankName: z.string().trim().default(''),
		branch: z.string().trim().default(''),
		accountNo: z.string().trim().default(''),
		status: z.enum(['Positive', 'Negative']),
		otherDebits: z.string().trim().default(''),
		cd: z.string().trim().default(''),
		remarks: z.enum(['Recommended', 'Not Recommended']),
	});

	const bankVerificationSchema = z.object({
		type: z.literal('bank-verification'),
		applicant: bankDetails,
		coApplicant: bankDetails,
		remarks: z.enum(['Recommended', 'Not Recommended']),
	});

	const businessDetails = z.object({
		designation: z.string().trim().default(''),
		businessTenure: z.number().default(0),
		visitingCard: z.boolean().default(false),
		companyName: z.string().trim().default(''),
	});

	const businessInteriors = z.object({
		painted: z.boolean().default(false),
		carpeted: z.boolean().default(false),
		curtains: z.boolean().default(false),
		clean: z.boolean().default(false),
	});

	const businessVerificationSchema = z.object({
		type: z.literal('business-verification'),
		businessDetails: businessDetails,
		companyType: z.enum([
			'Proprietorship',
			'Partnership',
			'Private Limited',
			'Public Limited',
			'Others',
		]),
		productDetails: z.string().trim().default(''),
		employees: z.number().default(0),
		customersPerDay: z.number().default(0),
		averageMonthlyIncome: z.number().default(0),
		businessBoard: z.string().trim().default(''),
		nameVerifiedBy: z.enum(['Receptionist', 'Security Guard', 'Colleague', 'Others']),
		officeArea: z.number().default(0),
		premises: z.enum(['Owned', 'Rented', 'Leased', 'Shared']),
		officeConstruction: z.enum(['Pukka', 'Semi-Pukka', 'Temporary']),
		exteriors: z.enum(['Good', 'Average', 'Poor']),
		interiors: businessInteriors,
		locationEase: z.enum(['Easy', 'Difficult', 'Untraceable']),
		businessActivity: z.enum(['High', 'Medium', 'Low']),
		employeeSighted: z.number().default(0),
		customersSighted: z.number().default(0),
		affiliation: z.string().trim().default(''),
		recommended: z.enum(['Recommended', 'Not Recommended']),
		remarks: z.string().trim().default(''),
	});

	const employmentDetails = z.object({
		organizationName: z.string().trim().default(''),
		employeesCount: z.number().default(0),
		branchesCount: z.number().default(0),
		visitingCard: z.boolean().default(false),
	});

	const salaryDetails = z.object({
		name: z.string().trim().default(''),
		mode: z.enum(['Cash', 'Cheque', 'Bank Transfer', 'Others']),
		bankName: z.string().trim().default(''),
		salary: z.number().default(0),
		designation: z.string().trim().default(''),
	});

	const employmentInteriors = z.object({
		painted: z.boolean().default(false),
		carpeted: z.boolean().default(false),
		curtains: z.boolean().default(false),
		clean: z.boolean().default(false),
	});

	const employmentVerificationSchema = z.object({
		type: z.literal('employment-verification'),
		employmentDetails: employmentDetails,
		jobType: z.enum(['Permanent', 'Probation', 'Contract Worker', 'Temporary', 'Others']),
		workingAs: z.enum([
			'Assistant',
			'Clerk',
			'Typist',
			'Stenographer',
			'Skilled Labour',
			'Supervisor',
			'Junior Management',
			'Middle Management',
			'Senior Management',
			'Other',
		]),
		jobTransferable: z.boolean().default(false),
		salaryDetails: salaryDetails,
		interiors: employmentInteriors,
		recommended: z.enum(['Recommended', 'Not Recommended']),
		remarks: z.string().trim().default(''),
		officeRemarks: z.enum(['Positive', 'Negative']),
	});

	const incomeTaxRecord = z.object({
		ward: z.string().trim().default(''),
		fillingDate: z.string().trim().default(''),
		salary: z.number().default(0),
		house: z.number().default(0),
		business: z.number().default(0),
		capitalGain: z.number().default(0),
		otherSource: z.number().default(0),
		grossTotal: z.number().default(0),
		deduction: z.number().default(0),
		taxPaid: z.number().default(0),
		netIncome: z.number().default(0),
		remarks: z.enum(['Positive', 'Negative']),
	});

	const incomeTaxFinancialYear = z.object({
		financialYear: z.string().trim().default(''),
		incomeTaxRecord: incomeTaxRecord,
		customerRecord: incomeTaxRecord,
	});

	const incomeTaxVerificationSchema = z.object({
		type: z.literal('income-tax-verification'),
		panNo: z.string().trim().default(''),
		financialRecords: z.array(incomeTaxFinancialYear),
		remarks: z.enum(['Positive', 'Negative']),
	});

	const contactedPerson = z.object({
		name: z.string().trim().default(''),
		dob: z.string().trim().default(''),
		relationship: z.string().trim().default(''),
		residingFor: z.string().trim().default(''),
		education: z.string().trim().default(''),
	});

	const maritalStatus = z.object({
		status: z.enum(['Married', 'Unmarried', 'Separated', 'Widowed']),
		members: z.number().default(0),
		workingMembers: z.number().default(0),
		dependents: z.number().default(0),
		children: z.number().default(0),
		spouseWorking: z.boolean().default(false),
		spouseEmploymentDetails: z.string().trim().default(''),
	});

	const vehicleDetails = z.object({
		twoWheeler: z.boolean().default(false),
		car: z.boolean().default(false),
		other: z.boolean().default(false),
	});

	const financeDetails = z.object({
		financerName: z.string().trim().default(''),
		loanNo: z.string().trim().default(''),
		loanOs: z.string().trim().default(''),
		emi: z.number().default(0),
	});

	const residenceInteriors = z.object({
		cemented: z.enum(['RCC Cemented', 'Non RCC', '']),
		painted: z.boolean().default(false),
		carpeted: z.boolean().default(false),
		curtains: z.boolean().default(false),
		sofa: z.boolean().default(false),
		venetianBlinds: z.boolean().default(false),
	});

	const residenceExteriors = z.object({
		overallCondition: z.enum(['Good', 'Bad', 'Average', 'Excellent']),
		television: z.boolean().default(false),
		refrigerator: z.boolean().default(false),
		musicSystem: z.boolean().default(false),
		twoWheeler: z.boolean().default(false),
		car: z.boolean().default(false),
		airConditioner: z.boolean().default(false),
	});

	const neighborhoodObservations = z.object({
		staysInResidence: z.boolean().default(false),
		availability: z.string().trim().default(''),
		averageAge: z.number().default(0),
		noOfMembers: z.number().default(0),
		remarks: z.enum(['Positive', 'Negative']),
	});

	const residenceVerificationSchema = z.object({
		type: z.literal('residence-verification'),
		addressConfirmed: z.boolean().default(false),
		dateOfVisit: z
			.string()
			.trim()
			.transform((val) => DateUtils.getMoment(val).toDate()),
		residenceContacted: contactedPerson,
		residenceType: z.enum([
			'Self owned',
			'Owned by relatives',
			'Rented',
			'Paying Guest',
			'Owned by parents',
			'Owned by friends',
			'Company Accommodation',
			'Lodging',
		]),
		maritalStatus: maritalStatus,
		vehicleDetails: vehicleDetails,
		financeDetails: financeDetails,
		nature: z.enum(['Polite', 'Rude', 'Aggressive', 'Cooperative', 'Suspicious', 'Uncooperative']),
		neighborhood: z.enum(['Positive', 'Negative', 'Neutral']),
		neighborhoodContacted: z.array(z.string().trim()).default([]),

		interiors: residenceInteriors,
		exterior: residenceExteriors,
		carpetArea: z.number().default(0),
		politicalPictures: z.string().trim().default(''),
		livingStandard: z.enum(['High', 'Medium', 'Low']),
		remarks: z.enum(['Positive', 'Negative']),
		neighborhoodObservations: neighborhoodObservations,
	});

	const teleCallingLog = z.object({
		contactedAt: z
			.string()
			.trim()
			.transform((val) => DateUtils.getMoment(val).toDate()),
		outcome: z.string().trim(),
	});

	const guarantor = z.object({
		employmentDetails: z.string().trim().default(''),
		otherLoans: z.string().trim().default(''),
		awareOfLiabilities: z.string().trim().default(''),
		awareOfApplicant: z.string().trim().default(''),
		loanQuantum: z.string().trim().default(''),
	});

	const teleCalling = z.object({
		teleCallingResidenceAttempt1: teleCallingLog,
		teleCallingResidenceAttempt2: teleCallingLog,
		teleCallingResidenceAttempt3: teleCallingLog,
		teleCallingOfficeAttempt1: teleCallingLog,
		teleCallingOfficeAttempt2: teleCallingLog,
		teleCallingOfficeAttempt3: teleCallingLog,
	});

	const teleVerificationBusinessDetails = z.object({
		name: z.string().trim().default(''),
		nature: z.string().trim().default(''),
		address: z.string().trim().default(''),
		activeSince: z.string().trim().default(''),
		designation: z.string().trim().default(''),
		department: z.string().trim().default(''),
	});

	const teleVerificationSchema = z.object({
		type: z.literal('tele-verification'),
		residenceContacted: contactedPerson,
		officeContacted: contactedPerson,
		businessDetails: teleVerificationBusinessDetails,
		residenceTeleCalling: teleCalling,
		guarantor: guarantor,
		reference1: contactedPerson,
		reference2: contactedPerson,
		guarantorTeleCalling: teleCalling,
		outcome: z.string().trim(),
		remarks: z.string().trim(),
		verificationResult: z.enum(['Positive', 'Negative']),
	});

	const verificationFormSchema = z.object({
		type: z.literal('verification-form'),
		applicationNo: z.string().trim().default(''),
		coApplicantName: z.string().trim().default(''),
		dateOfApplication: z
			.string()
			.trim()
			.transform((val) => DateUtils.getMoment(val).toDate()),
		applicantName: z.string().trim().default(''),
		residence: z.string().trim().default(''),
		telephone: z.string().trim().default(''),
		signedDate: z
			.string()
			.trim()
			.transform((val) => DateUtils.getMoment(val).toDate()),
		signedPlace: z.string().trim().default(''),
	});

	const reqValidator = z.union([
		bankVerificationSchema,
		businessVerificationSchema,
		employmentVerificationSchema,
		incomeTaxVerificationSchema,
		residenceVerificationSchema,
		teleVerificationSchema,
		verificationFormSchema,
	]);

	const reqValidatorResult = reqValidator.safeParse(req.body);

	if (reqValidatorResult.success) {
		req.locals.data = reqValidatorResult.data;
		return next();
	}

	return next(
		new CustomError({
			STATUS: 400,
			TITLE: 'INVALID_FIELDS',
			MESSAGE: "Invalid fields in the request's body.",
			OBJECT: reqValidatorResult.error.flatten(),
		})
	);
}
