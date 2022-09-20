Profile: PatientReport
Id: gosh-patient-profile
Parent: Patient
Title: "Patient Profile for Genomics data recording at GOSH"
Description: "How to report Genomics data in GOSH"
* name 1..*
* name and name.given and name.family MS
* managingOrganization only Reference(Organization)

* name ^short = "Official name (i.e., legal name) of patient"
* name ^definition = "Official name (i.e., legal name) of the patient, corresponding to `official` in [this value set](https://www.hl7.org/fhir/valueset-name-use.html)."
* extension contains "https://fhir.nhs.uk/R4/StructureDefinition/Extension-UKCore-NHSNumberVerificationStatus" named NHSNumberVerificationStatus 0..* MS
// The contents of `^comment` are also displayed on the "Detailed Descriptions" tab
// in the built Implementation Guide.
* birthDate ^comment = "If exact date of birth is partially or completely unknown, Implementers SHALL populate this element with the date of birth information listed on the patient's government-issued identification."

// Do not allow `gender` to be included.
* gender 1..1