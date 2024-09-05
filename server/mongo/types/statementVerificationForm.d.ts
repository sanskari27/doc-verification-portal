export interface IStatementVerificationForm {
  applicant: IStatementVerification;
  coApplicant: IStatementVerification;
}

interface IStatementVerification {
  name: string;
  bankName: string;
  branchAddress: string;
  accountNo: string;
  status: string;
  anyOtherCredit: string;
  cdNoticed: string;
  frequencyType: string;
  remarks: string;
}
