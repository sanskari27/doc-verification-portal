import mongoose, { Schema } from 'mongoose';
import { IResidenceVerificationForm } from '../types/residenceVerificationForm';

const ResidentialStatusSchema = new Schema({
    selfOwned: { type: String, required: true, default: 'NA' },
    ownedByRelatives: { type: String, required: true, default: 'NA' },
    rented: { type: String, required: true, default: 'NA' },
    payingGuest: { type: String, required: true, default: 'NA' },
    ownedByParents: { type: String, required: true, default: 'NA' },
    ownedByFriends: { type: String, required: true, default: 'NA' },
    companyAccommodation: { type: String, required: true, default: 'NA' },
    lodging: { type: String, required: true, default: 'NA' },
}, { _id: false });

const MaritalStatusSchema = new Schema({
    maritalStatus: { type: String, required: true, default: 'Unmarried' },
    noOfFamilyMembers: { type: Number, required: true, default: 0 },
    workingPerson: { type: Number, required: true, default: 0 },
    dependentAdults: { type: Number, required: true, default: 0 },
    children: { type: Number, required: true, default: 0 },
    spouseWorking: { type: String, required: true, default: 'NA' },
    spouseEmploymentDetails: { type: String, required: true, default: 'NA' },
}, { _id: false });

const PresentVehicleSchema = new Schema({
    twoWheeler: { type: String, required: true, default: 'NA' },
    car: { type: String, required: true, default: 'NA' },
    others: { type: String, required: true, default: 'NA' },
}, { _id: false });

const FinancerDetailSchema = new Schema({
    financerName: { type: String, required: true, default: 'NA' },
    loanNumber: { type: String, required: true, default: 'NA' },
    osLoan: { type: String, required: true, default: 'NA' },
    emi: { type: String, required: true, default: 'NA' },
}, { _id: false });

const NeighbourhoodCheckSchema = new Schema({
    positive: { type: String, required: true, default: 'NA' },
    negative: { type: String, required: true, default: 'NA' },
    checkedWith: { type: String, required: true, default: 'NA' },
}, { _id: false });

const ConstructionResidenceSchema = new Schema({
    painted: { type: Boolean, required: true, default: false },
    clean: { type: Boolean, required: true, default: false },
    carpeted: { type: Boolean, required: true, default: false },
    curtains: { type: Boolean, required: true, default: false },
    sofa: { type: Boolean, required: true, default: false },
    venetianBlind: { type: Boolean, required: true, default: false },
}, { _id: false });

const ExteriorsResidenceSchema = new Schema({
    television: { type: String, required: true, default: 'NA' },
    refrigerator: { type: String, required: true, default: 'NA' },
    musicSystem: { type: String, required: true, default: 'NA' },
    twoWheeler: { type: String, required: true, default: 'NA' },
    car: { type: String, required: true, default: 'NA' },
    airConditioner: { type: String, required: true, default: 'NA' },
}, { _id: false });

const DetailsFromNeighbourSchema = new Schema({
    applicantStayAtHouse: { type: String, required: true, default: 'NA' },
    ageOfApplicant: { type: Number, required: true, default: 0 },
    availabilityOfApplicant: { type: String, required: true, default: 'NA' },
    noOfFamilyMembers: { type: Number, required: true, default: 0 },
}, { _id: false });

const ResidenceVerificationFormSchema = new mongoose.Schema<IResidenceVerificationForm>({
    applicationNo: { type: String, required: true, default: 'NA' },
    dateOfApplication: { type: Date, required: true, default: Date.now },
    applicantName: { type: String, required: true, default: 'NA' },
    applicantSalutation: { type: String, required: true, default: 'Mr.' },
    coApplicantName: { type: String, required: true, default: 'NA' },
    coApplicantSalutation: { type: String, required: true, default: 'Mr.' },
    residenceAddress: { type: String, required: true, default: 'NA' },
    telephoneNumber: { type: String, required: true, default: 'NA' },
    addressConfirmed: { type: Boolean, required: true, default: false },
    dateOfVisit: { type: Date, required: true, default: Date.now },
    personContacted: { type: String, required: true, default: 'NA' },
    relationWithApplicant: { type: String, required: true, default: 'NA' },
    applicantDOB: { type: Date, required: true, default: Date.now },
    noOfYearsAtCurrentResidence: { type: String, required: true, default: '0' },
    educationalQualification: { type: String, required: true, default: 'NA' },
    residentialStatus: { type: ResidentialStatusSchema, required: true, default: () => ({}) },
    maritalStatus: { type: MaritalStatusSchema, required: true, default: () => ({}) },
    presentVehicle: { type: PresentVehicleSchema, required: true, default: () => ({}) },
    financerDetail: { type: FinancerDetailSchema, required: true, default: () => ({}) },
    customerCooperation: { type: String, required: true, default: 'Polite' },
    neighbourhoodCheck: { type: NeighbourhoodCheckSchema, required: true, default: () => ({}) },
    constructionResidence: { type: ConstructionResidenceSchema, required: true, default: () => ({}) },
    exteriorsResidence: { type: ExteriorsResidenceSchema, required: true, default: () => ({}) },
    carpetArea: { type: Number, required: true, default: 0 },
    picturePortrait: { type: Boolean, required: true, default: false },
    remarks: { type: String, required: true, default: 'NA' },
    recommended: { type: Boolean, required: true, default: true },
    detailsFromNeighbour: { type: DetailsFromNeighbourSchema, required: false },
});

export default mongoose.model<IResidenceVerificationForm>('ResidenceVerificationForm', ResidenceVerificationFormSchema);