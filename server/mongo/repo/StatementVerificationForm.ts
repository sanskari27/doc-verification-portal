import { Schema } from "mongoose";

const StatementVerificationSchema = new Schema({
  name: { type: String, default: "NA", required: true },
  bankName: { type: String, default: "NA", required: true },
  branchAddress: { type: String, default: "NA", required: true },
  accountNo: { type: String, default: "NA", required: true },
  status: { type: String, default: "NA", required: true },
  anyOtherCredit: { type: String, default: "NA", required: true },
  cdNoticed: { type: String, default: "NA", required: true },
  frequencyType: { type: String, default: "NA", required: true },
  remarks: { type: String, default: "NA", required: true },
});

export const StatementVerificationFormSchema = new Schema({
  applicant: {
    type: StatementVerificationSchema,
    default: () => ({}),
    required: true,
  },
  coApplicant: {
    type: StatementVerificationSchema,
    default: () => ({}),
    required: true,
  },
});
