import mongoose, { Schema } from "mongoose";
import { ISalariedPersonForm } from "../types/salariedPersonForm";
import { ResidenceVerificationFormSchema } from "./ResidenceVerificationForm";
import { TeleVerificationFormSchema } from "./TeleVerificationForm";
import { EmploymentVerificationFormSchema } from "./EmploymentVerificationForm";
import { StatementVerificationFormSchema } from "./StatementVerificationForm";

const SalariedPersonFormSchema = new Schema<ISalariedPersonForm>({
  applicationNo: { type: String, required: true, default: "NA" },
  dateOfApplication: { type: Date, required: true, default: "NA" },
  applicantName: { type: String, required: true, default: "NA" },
  applicantSalutation: { type: String, required: true, default: "NA" },
  residenceVerificationForm: {
    type: ResidenceVerificationFormSchema,
    required: true,
    default: () => ({}),
  },
  teleVerificationForm: {
    type: TeleVerificationFormSchema,
    required: true,
    default: () => ({}),
  },
  employmentVerificationForm: {
    type: EmploymentVerificationFormSchema,
    required: true,
    default: () => ({}),
  },
  statementVerificationForm: {
    type: StatementVerificationFormSchema,
    required: true,
    default: () => ({}),
  },
});

export default mongoose.model<ISalariedPersonForm>(
  "ISalariedPersonForm",
  SalariedPersonFormSchema
);
