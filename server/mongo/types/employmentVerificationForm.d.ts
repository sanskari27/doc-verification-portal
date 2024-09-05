export interface IEmploymentVerificationForm {
  officeAddress: string;
  addressConfirmed: string;
  applicantDesignation: string;
  dateOfVisit: Date;
  timeOfVisit: string;
  hrDetails: IHRDetails;
  applicantJobType: IApplicantJobType;
  applicantWorking: IApplicantWorking;
  applicantJobTransferable: string;
  salaryDetails: ISalaryDetails;
  recommended: boolean;
  officeRemark: string;
}

interface IHRDetails {
  name: string;
  designation: string;
  telephoneNo: string;
  extensionNo: string;
  mobileNo: string;
  visitingCardObtained: string;
  organisationName: string;
  noOfEmployee: number;
  noOfBranches: number;
}

interface IApplicantJobType {
  permanent: string;
  probation: string;
  contractWorker: string;
  temporaryWorker: string;
}

interface IApplicantWorking {
  assistant: string;
  clerk: string;
  typist: string;
  stenographer: string;
  skilledLabour: string;
  supervisor: string;
  juniorManagement: string;
  middleManagement: string;
  seniorManagement: string;
  other: string;
}

interface ISalaryDetails {
  salaryVerifiedFrom: string;
  designation: string;
  salaryMode: string;
  bankAccount: string;
  salaryReceived: string;
}
