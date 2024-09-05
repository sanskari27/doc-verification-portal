import { Schema } from "mongoose";

const HRDetailsSchema = new Schema({
  name: { type: String, default: "NA", required: true },
  designation: { type: String, default: "NA", required: true },
  telephoneNo: { type: String, default: "NA", required: true },
  extensionNo: { type: String, default: "NA", required: true },
  mobileNo: { type: String, default: "NA", required: true },
  visitingCardObtained: { type: String, default: "NA", required: true },
  organisationName: { type: String, default: "NA", required: true },
  noOfEmployee: { type: Number, default: 0, required: true },
  noOfBranches: { type: Number, default: 0, required: true },
});

const ApplicantJobTypeSchema = new Schema({
  permanent: { type: String, default: "NA", required: true },
  probation: { type: String, default: "NA", required: true },
  contractWorker: { type: String, default: "NA", required: true },
  temporaryWorker: { type: String, default: "NA", required: true },
});

const ApplicantWorkingSchema = new Schema({
  assistant: { type: String, default: "NA", required: true },
  clerk: { type: String, default: "NA", required: true },
  typist: { type: String, default: "NA", required: true },
  stenographer: { type: String, default: "NA", required: true },
  skilledLabour: { type: String, default: "NA", required: true },
  supervisor: { type: String, default: "NA", required: true },
  juniorManagement: { type: String, default: "NA", required: true },
  middleManagement: { type: String, default: "NA", required: true },
  seniorManagement: { type: String, default: "NA", required: true },
  other: { type: String, default: "NA", required: true },
});

const SalaryDetailsSchema = new Schema({
  salaryVerifiedFrom: { type: String, default: "NA", required: true },
  designation: { type: String, default: "NA", required: true },
  salaryMode: { type: String, default: "NA", required: true },
  bankAccount: { type: String, default: "NA", required: true },
  salaryReceived: { type: String, default: "NA", required: true },
});

export const EmploymentVerificationFormSchema = new Schema({
  officeAddress: { type: String, default: "NA", required: true },
  addressConfirmed: { type: String, default: "NA", required: true },
  applicantDesignation: { type: String, default: "NA", required: true },
  dateOfVisit: { type: Date, default: Date.now, required: true },
  timeOfVisit: { type: String, default: "NA", required: true },
  hrDetails: { type: HRDetailsSchema, default: () => ({}), required: true },
  applicantJobType: {
    type: ApplicantJobTypeSchema,
    default: () => ({}),
    required: true,
  },
  applicantWorking: {
    type: ApplicantWorkingSchema,
    default: () => ({}),
    required: true,
  },
  applicantJobTransferable: { type: String, default: "NA", required: true },
  salaryDetails: {
    type: SalaryDetailsSchema,
    default: () => ({}),
    required: true,
  },
  recommended: { type: Boolean, default: false, required: true },
  officeRemark: { type: String, default: "NA", required: true },
});
