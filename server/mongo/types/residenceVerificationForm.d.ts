export interface IResidenceVerificationForm {
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
  selfOwned: string;
  ownedByRelatives: string;
  rented: string;
  payingGuest: string;
  ownedByParents: string;
  ownedByFriends: string;
  companyAccommodation: string;
  lodging: string;
}

interface IMaritalStatus {
  maritalStatus: string;
  noOfFamilyMembers: number;
  workingPerson: number;
  dependentAdults: number;
  children: number;
  spouseWorking: string;
  spouseEmploymentDetails: string;
}

interface IPresentVehicle {
  twoWheeler: string;
  car: string;
  others: string;
}

interface IFinancerDetail {
  financerName: string;
  loanNumber: string;
  osLoan: string;
  emi: string;
}

interface INeighbourhoodCheck {
  positive: string;
  negative: string;
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
  television: string;
  refrigerator: string;
  musicSystem: string;
  twoWheeler: string;
  car: string;
  airConditioner: string;
}

interface IDetailsFromNeighbour {
  applicantStayAtHouse: string;
  ageOfApplicant: number;
  availabilityOfApplicant: string;
  noOfFamilyMembers: number;
}
