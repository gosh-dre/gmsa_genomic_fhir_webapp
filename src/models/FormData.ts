export interface Patient {
  mrn: string
  firstName: string,
  lastName: string,
  dateOfBirth: Date | string,
  gender: string,
  familyNumber: string,
}

export interface Address {
  streetAddress: string[],
  city: string,
  postCode: string,
  country: string,
}

export interface Sample {
  specimenCode: string,
  collectionDateTime: Date | string,
  specimenType: string,
  reasonForTestCode: string,
  reasonForTestText: string,
}

export interface Variant {
  gene: string,
  transcript: string,
  genomicHGVS: string,
  proteinHGVS: string,
  zygosity: string,
  classification: string,
  inheritanceMethod: string,
  referenceNucleotide: string,
  variantNucleotide: string,
  classificationEvidence: string,
}

export interface ReportDetails {
  resultSummary: string,
  reportingScientist: string,
  reportingScientistTitle: string,
  reportingDate: string,
  authorisingScientist: string,
  authorisingScientistTitle: string,
  authorisingDate: string,
  furtherTesting: string,
  testMethodology: string
}
