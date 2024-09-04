import mongoose, { Schema } from 'mongoose';
import { IResidenceVerificationForm } from '../types/residenceVerificationForm';

const ResidentialStatusSchema = new Schema({
    selfOwned: { type: Boolean, required: true },
    ownedByRelatives: { type: Boolean, required: true },
    rented: { type: Boolean, required: true },
    payingGuest: { type: Boolean, required: true },
    ownedByParents: { type: Boolean, required: true },
    ownedByFriends: { type: Boolean, required: true },
    companyAccommodation: { type: Boolean, required: true },
    lodging: { type: Boolean, required: true },
}, { _id: false });

const MaritalStatusSchema = new Schema({
    maritalStatus: { type: String, required: true },
    noOfFamilyMembers: { type: Number, required: true },
    workingPerson: { type: Number, required: true },
    dependentAdults: { type: Number, required: true },
    children: { type: Number, required: true },
    spouseWorking: { type: Boolean, required: true },
    spouseEmploymentDetails: { type: String, required: true },
}, { _id: false });

const PresentVehicleSchema = new Schema({
    twoWheeler: { type: Boolean, required: true },
    car: { type: Boolean, required: true },
    others: { type: Boolean, required: true },
}, { _id: false });

const FinancerDetailSchema = new Schema({
    financerName: { type: String, required: true },
    loanNumber: { type: String, required: true },
    osLoan: { type: String, required: true },
    emi: { type: String, required: true },
}, { _id: false });

const NeighbourhoodCheckSchema = new Schema({
    positive: { type: Boolean, required: true },
    negative: { type: Boolean, required: true },
    checkedWith: { type: String, required: true },
}, { _id: false });

const ConstructionResidenceSchema = new Schema({
    painted: { type: Boolean, required: true },
    clean: { type: Boolean, required: true },
    carpeted: { type: Boolean, required: true },
    curtains: { type: Boolean, required: true },
    sofa: { type: Boolean, required: true },
    venetianBlind: { type: Boolean, required: true },
}, { _id: false });

const ExteriorsResidenceSchema = new Schema({
    television: { type: Boolean, required: true },
    refrigerator: { type: Boolean, required: true },
    musicSystem: { type: Boolean, required: true },
    twoWheeler: { type: Boolean, required: true },
    car: { type: Boolean, required: true },
    airConditioner: { type: Boolean, required: true },
}, { _id: false });

const DetailsFromNeighbourSchema = new Schema({
    applicantStayAtHouse: { type: Boolean, required: true },
    ageOfApplicant: { type: Number, required: true },
    availabilityOfApplicant: { type: String, required: true },
    noOfFamilyMembers: { type: Number, required: true },
}, { _id: false });

const ResidenceFormSchema = new mongoose.Schema<IResidenceVerificationForm>({
    applicationNo: { type: String, required: true },
    dateOfApplication: { type: Date, required: true },
    applicantName: { type: String, required: true },
    applicantSalutation: { type: String, required: true },
    coApplicantName: { type: String, required: true },
    coApplicantSalutation: { type: String, required: true },
    residenceAddress: { type: String, required: true },
    telephoneNumber: { type: String, required: true },
    addressConfirmed: { type: Boolean, required: true },
    dateOfVisit: { type: Date, required: true },
    personContacted: { type: String, required: true },
    relationWithApplicant: { type: String, required: true },
    applicantDOB: { type: Date, required: true },
    noOfYearsAtCurrentResidence: { type: String, required: true },
    educationalQualification: { type: String, required: true },
    residentialStatus: { type: ResidentialStatusSchema, required: true },
    maritalStatus: { type: MaritalStatusSchema, required: true },
    presentVehicle: { type: PresentVehicleSchema, required: true },
    financerDetail: { type: FinancerDetailSchema, required: true },
    customerCooperation: { type: String, required: true },
    neighbourhoodCheck: { type: NeighbourhoodCheckSchema, required: true },
    constructionResidence: { type: ConstructionResidenceSchema, required: true },
    exteriorsResidence: { type: ExteriorsResidenceSchema, required: true },
    carpetArea: { type: Number, required: true },
    picturePortrait: { type: Boolean, required: true },
    remarks: { type: String, required: true },
    recommended: { type: Boolean, required: true },
    detailsFromNeighbour: { type: DetailsFromNeighbourSchema, required: false },
});

export default mongoose.model<IResidenceVerificationForm>('ResidenceForm', ResidenceFormSchema);