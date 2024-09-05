import mongoose, { Schema } from "mongoose";

const TelephoneVerificationSchema = new Schema(
  {
    residenceContactNumber: { type: Number, required: true, default: 0 },
    residenceContactPerson: { type: String, required: true, default: "NA" },
    residenceRelationWithApplicant: {
      type: String,
      required: true,
      default: "NA",
    },
    officeContactNumber: { type: Number, required: true, default: 0 },
    officeContactPerson: { type: String, required: true, default: "NA" },
    officeRelationWithApplicant: {
      type: String,
      required: true,
      default: "NA",
    },
  },
  { _id: false }
);

const BusinessDetailsSchema = new Schema(
  {
    companyName: { type: String, required: true, default: "NA" },
    businessNature: { type: String, required: true, default: "NA" },
    officeAddress: { type: String, required: true, default: "NA" },
    noOfYearsWorking: { type: String, required: true, default: "NA" },
    designation: { type: String, required: true, default: "NA" },
    department: { type: String, required: true, default: "NA" },
  },
  { _id: false }
);

const TeleCallLogSchema = new Schema(
  {
    date: { type: Date, required: true, default: Date.now },
    time: { type: String, required: true, default: "NA" },
    outcome: { type: String, required: true, default: "NA" },
  },
  { _id: false }
);

const GaurantorDetailsSchema = new Schema(
  {
    name: { type: String, required: true, default: "NA" },
    telephoneNo: { type: String, required: true, default: "NA" },
    relationWithApplicant: { type: String, required: true, default: "NA" },
    yearKnownApplicant: { type: String, required: true, default: "NA" },
    employmentDetail: { type: String, required: true, default: "NA" },
    gaurantorForOtherLoan: { type: String, required: true, default: "NA" },
    awareLiabilityAsGaurantor: { type: String, required: true, default: "NA" },
    awareOfApplicant: { type: String, required: true, default: "NA" },
    loanQuantamEmi: { type: String, required: true, default: "NA" },
  },
  { _id: false }
);

const DetailsOfReferenceSchema = new Schema(
  {
    name: { type: String, required: true, default: "NA" },
    telephoneNo: { type: String, required: true, default: "NA" },
    relationWithApplicant: { type: String, required: true, default: "NA" },
    yearKnownApplicant: { type: String, required: true, default: "NA" },
  },
  { _id: false }
);

export const TeleVerificationFormSchema = new Schema({
  coApplicantName: { type: String, required: true, default: "NA" },
  coApplicantSalutation: { type: String, required: true, default: "Mr./Ms." },
  applicantDOB: { type: Date, required: true, default: Date.now },
  residenceAddress: { type: String, required: true, default: "NA" },
  permanentAddress: { type: String, required: true, default: "NA" },
  telephoneVerification: {
    type: TelephoneVerificationSchema,
    required: true,
    default: () => ({}),
  },
  businessDetails: {
    type: BusinessDetailsSchema,
    required: true,
    default: () => ({}),
  },
  teleCallResidentAttempt1: {
    type: TeleCallLogSchema,
    required: true,
    default: () => ({}),
  },
  teleCallResidentAttempt2: {
    type: TeleCallLogSchema,
    required: true,
    default: () => ({}),
  },
  teleCallResidentAttempt3: {
    type: TeleCallLogSchema,
    required: true,
    default: () => ({}),
  },
  teleCallOfficeAttempt1: {
    type: TeleCallLogSchema,
    required: true,
    default: () => ({}),
  },
  teleCallOfficeAttempt2: {
    type: TeleCallLogSchema,
    required: true,
    default: () => ({}),
  },
  teleCallOfficeAttempt3: {
    type: TeleCallLogSchema,
    required: true,
    default: () => ({}),
  },
  gaurantorDetails: {
    type: GaurantorDetailsSchema,
    required: true,
    default: () => ({}),
  },
  detailsOfReference1: {
    type: DetailsOfReferenceSchema,
    required: true,
    default: () => ({}),
  },
  detailsOfReference2: {
    type: DetailsOfReferenceSchema,
    required: true,
    default: () => ({}),
  },
  teleCallGaurantorAttempt1: {
    type: TeleCallLogSchema,
    required: true,
    default: () => ({}),
  },
  teleCallGaurantorAttempt2: {
    type: TeleCallLogSchema,
    required: true,
    default: () => ({}),
  },
  teleCallGaurantorAttempt3: {
    type: TeleCallLogSchema,
    required: true,
    default: () => ({}),
  },
  otherRemarks: { type: String, required: true, default: "NA" },
  teleVerificationResult: { type: Boolean, required: true, default: true },
});
