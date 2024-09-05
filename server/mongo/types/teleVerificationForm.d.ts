export interface ITeleVerificationForm {
  coApplicantName: string;
  coApplicantSalutation: string;
  applicantDOB: Date;
  residenceAddress: string;
  permanentAddress: string;
  telephoneVerification: ITelephoneVerification;
  businessDetails: IBusinessDetails;
  teleCallResidentAttempt1: ITeleCallLog;
  teleCallResidentAttempt2: ITeleCallLog;
  teleCallResidentAttempt3: ITeleCallLog;
  teleCallOfficeAttempt1: ITeleCallLog;
  teleCallOfficeAttempt2: ITeleCallLog;
  teleCallOfficeAttempt3: ITeleCallLog;
  gaurantorDetails: IGaurantorDetails;
  detailsOfReference1: IDetailsOfReference;
  detailsOfReference2: IDetailsOfReference;
  teleCallGaurantorAttempt1: ITeleCallLog;
  teleCallGaurantorAttempt2: ITeleCallLog;
  teleCallGaurantorAttempt3: ITeleCallLog;
  otherRemarks: string;
  teleVerificationResult: boolean;
}

interface ITelephoneVerification {
  residenceContactNumber: number;
  residenceContactPerson: string;
  residenceRelationWithApplicant: string;
  officeContactNumber: number;
  officeContactPerson: string;
  officeRelationWithApplicant: string;
}

interface IBusinessDetails {
  companyName: string;
  businessNature: string;
  officeAddress: string;
  noOfYearsWorking: string;
  designation: string;
  department: string;
}

interface ITeleCallLog {
  date: Date;
  time: string;
  outcome: string;
}

interface IGaurantorDetails {
  name: string;
  telephoneNo: string;
  relationWithApplicant: string;
  yearKnownApplicant: string;
  employmentDetail: string;
  gaurantorForOtherLoan: string;
  awareLiabilityAsGaurantor: string;
  awareOfApplicant: string;
  loanQuantamEmi: string;
}

interface IDetailsOfReference {
  name: string;
  telephoneNo: string;
  relationWithApplicant: string;
  yearKnownApplicant: string;
}
