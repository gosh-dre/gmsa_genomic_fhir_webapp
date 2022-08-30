Profile: GenomicsReport
Parent: Patient
Id: GenomicReportPatient
Description: "Patient for genomics report"
* name 1..* MS
* active = true
* gender MS
* identifier 1..* MS
* identifier.system from GoshPatientIdentifiers
* identifier.value MS
* birthDate MS
* managingOrganization only Reference(Organization)

Instance: JamesPond
InstanceOf: GenomicsReport
Description: "An example of a patient"
* name
  * given[0] = "James"
  * family = "Pond"
* gender = #male
* active = true
* identifier[+].system = GoshPatientIdentifiers#nhs-number
* identifier[=].value = "4857773456"
* identifier[+].system = GoshPatientIdentifiers#gosh-mrn
* identifier[=].value = "40057119"
* identifier[+].system = GoshPatientIdentifiers#gosh-family-number
* identifier[=].value = "Z60791509"
* birthDate = "2016-06-01"
* managingOrganization = Reference(TestOrg)

// define local CodeSystem and from that ValueSets
CodeSystem:  GoshPatientIdentifiers
Title: "GOSH patient identifiers"
Description:  "Patient-level identifiers at GOSH"
* #nhs-number "https://fhir.nhs.uk/Id/nhs-number" "NHS number"
  // should we define these within the FHIR server address?
  // e.g. "https://gosh-synth-fhir.azurehealthcareapis.com/Id/gosh-mrn"
* #gosh-mrn "https://fhir.nhs.uk/Id/gosh-mrn" "GOSH master record number, MRN"
* #gosh-family-number "https://fhir.nhs.uk/Id/gosh-family-number"  "GOSH family number."

ValueSet: GoshPatientIdentifiers
Title: "GOSH patient identifiers"
Description:  "Patient-level identifiers at GOSH"
* $NhsNaming#nhs-number
* GoshPatientIdentifiers#gosh-mrn
* GoshPatientIdentifiers#gosh-family-number

