Profile: CovidDiagnosis
Parent: Condition
Description: "How to report COVID"
* code = $icd#U07.1
* severity from CovidSeverityVS (required)
* subject only Reference(Patient)
* extension contains ConditionCertainty named certainty 0..1 MS

Alias: $icd = http://hl7.org/fhir/sid/icd-10-cm

ValueSet: CovidSeverityVS
Description: "Values for COVID severity"
* include codes from valueset http://hl7.org/fhir/ValueSet/condition-severity
* include $sct#442452003 "Life threatening severity (qualifier value)"

Alias: $sct = http://snomed.info/sct

Instance: DiagnosisExample
InstanceOf: CovidDiagnosis
* subject.reference = "Patient/JaneDoe"
* code = $icd#U07.1
* severity = $sct#24484000 "Severe"

Instance: JaneDoe
InstanceOf: Patient
* name.family = "Doe"
* name.given = "Jane"

Extension: ConditionCertainty
Description: "The certainty of diagnosis"
* value[x] only CodeableConcept
* value[x] from ConditionCertaintyVS

ValueSet: ConditionCertaintyVS
Description: "Degree of confidence the condition is present"
* $sct#415684004  "Suspected (qualifier value)"
* $sct#410592001  "Probably present (qualifier value)"	
* $sct#41060500   "Confirmed present (qualifier value)"