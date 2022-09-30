Profile: GenomicsPatient
Parent: Patient
Id: GenomicsPatient
Description: "Patient for genomics report"
* name 1..* MS
* active = true
* gender 1..1 MS
* identifier 1..* MS
* identifier.system from GoshPatientIdentifiers
* identifier.value 1..1 MS
* birthDate 1..1 MS
* managingOrganization only Reference(Organization)

Instance: JamesPond
InstanceOf: GenomicsPatient
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
* managingOrganization = Reference(GoshOrganization)

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
* $NHS_NAMING#nhs-number
* GoshPatientIdentifiers#gosh-mrn
* GoshPatientIdentifiers#gosh-family-number

