import { Document } from 'mongoose';

export interface IResidenceVerificationForm extends Document {
    applicationNo: string;
    dateOfApplication: Date;
    applicantName: string;
    applicantSalutation: string;
    coApplicantName: string;
    coApplicantSalutation: string;
    residenceAddress: string;
    telephoneNumber: string;
    addressConfirmed: boolean;
    dateOfVisit: Date;
    personContacted: string;
    relationWithApplicant: string;
    applicantDOB: Date;
    noOfYearsAtCurrentResidence: string;
    educationalQualification: string;
    residentialStatus: IResidentialStatus;
    maritalStatus: IMaritalStatus;
    presentVehicle: IPresentVehicle;
    financerDetail: IFinancerDetail;
    customerCooperation: string;
    neighbourhoodCheck: INeighbourhoodCheck;
    constructionResidence: IConstructionResidence;
    exteriorsResidence: IExteriorsResidence;
    carpetArea: number;
    picturePortrait: boolean;
    remarks: string;
    recommended: boolean;
    detailsFromNeighbour: IDetailsFromNeighbour;
}

interface IResidentialStatus {
    selfOwned: boolean;
    ownedByRelatives: boolean;
    rented: boolean;
    payingGuest: boolean;
    ownedByParents: boolean;
    ownedByFriends: boolean;
    companyAccommodation: boolean;
    lodging: boolean;
}

interface IMaritalStatus {
    maritalStatus: string;
    noOfFamilyMembers: number;
    workingPerson: number;
    dependentAdults: number;
    children: number;
    spouseWorking: boolean;
    spouseEmploymentDetails: string;
}

interface IPresentVehicle {
    twoWheeler: boolean;
    car: boolean;
    others: boolean;
}

interface IFinancerDetail {
    financerName: string;
    loanNumber: string;
    osLoan: string;
    emi: string;
}

interface INeighbourhoodCheck {
    positive: boolean;
    negative: boolean;
    checkedWith: string;
}

interface IConstructionResidence {
    painted: boolean;
    clean: boolean;
    carpeted: boolean;
    curtains: boolean;
    sofa: boolean;
    venetianBlind: boolean;
}

interface IExteriorsResidence {
    television: boolean;
    refrigerator: boolean;
    musicSystem: boolean;
    twoWheeler: boolean;
    car: boolean;
    airConditioner: boolean;
}

interface IDetailsFromNeighbour {
    applicantStayAtHouse: boolean;
    ageOfApplicant: number;
    availabilityOfApplicant: string;
    noOfFamilyMembers: number;
}


