import mongoose from "mongoose";
import {
  BusinessDetails,
  BusinessInteriors,
  IBusinessVerificationForm,
} from "../types/businessVerificationForm";
import { TaskDB_name } from "./Task";

const BusinessDetailsSchema = new mongoose.Schema<BusinessDetails>(
  {
    designation: String,
    businessTenure: Number,
    visitingCard: Boolean,
    companyName: String,
  },
  { _id: false }
);

const BusinessInteriorsSchema = new mongoose.Schema<BusinessInteriors>(
  {
    painted: Boolean,
    carpeted: Boolean,
    curtains: Boolean,
    clean: Boolean,
  },
  { _id: false }
);

const BusinessVerificationFormSchema =
  new mongoose.Schema<IBusinessVerificationForm>({
    task_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: TaskDB_name,
      required: true,
      unique: true,
    },
    businessDetails: BusinessDetailsSchema,
    companyType: {
      type: String,
      enum: [
        "Proprietorship",
        "Partnership",
        "Private Limited",
        "Public Limited",
        "Others",
      ],
    },
    productDetails: String,
    employees: Number,
    customersPerDay: Number,
    averageMonthlyIncome: Number,
    businessBoard: String,
    nameVerifiedBy: {
      type: String,
      enum: ["Receptionist", "Security Guard", "Colleague", "Others"],
    },
    officeArea: Number,
    premises: {
      type: String,
      enum: ["Owned", "Rented", "Leased", "Shared"],
    },
    officeConstruction: {
      type: String,
      enum: ["Pukka", "Semi-Pukka", "Temporary"],
    },
    exteriors: {
      type: String,
      enum: ["Good", "Average", "Poor"],
    },
    interiors: BusinessInteriorsSchema,
    locationEase: {
      type: String,
      enum: ["Easy", "Difficult", "Untraceable"],
    },
    businessActivity: {
      type: String,
      enum: ["High", "Medium", "Low"],
    },
    employeeSighted: Number,
    customersSighted: Number,
    affiliation: String,
    recommended: {
      type: String,
      enum: ["Recommended", "Not Recommended"],
    },
    remarks: String,
  });
export const BusinessVerificationFormDB_name = "BusinessVerificationForm";

export default mongoose.model<IBusinessVerificationForm>(
  BusinessVerificationFormDB_name,
  BusinessVerificationFormSchema
);
