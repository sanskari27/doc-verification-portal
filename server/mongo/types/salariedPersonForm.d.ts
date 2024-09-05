import { Document } from "mongoose";
import { IResidenceVerificationForm } from "./residenceVerificationForm";
import { ITeleVerificationForm } from "./teleVerificationForm";
import { IEmploymentVerificationForm } from "./employmentVerificationForm";
import { IStatementVerificationForm } from "./statementVerificationForm";

export interface ISalariedPersonForm extends Document {
  applicationNo: string;
  dateOfApplication: Date;
  applicantName: string;
  applicantSalutation: string;
  residenceVerificationForm: IResidenceVerificationForm;
  teleVerificationForm: ITeleVerificationForm;
  employmentVerificationForm: IEmploymentVerificationForm;
  statementVerificationForm: IStatementVerificationForm;
}
