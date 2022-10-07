Profile: GenomicsDiagnosticReport
Parent: DiagnosticReport
Id: GenomicsDiagnosticReport
Description: "An example profile for collecting diagnostic report for a genomics test"
* code 1..1
* code from GenomicDiseases
* effective[x] only dateTime  // Report authorisation date
* issued 1..1 // Reporting date
* performer only Reference(GenomicsOrganization)
* result only Reference(VariantInterpretation)
* resultsInterpreter 1..*
* resultsInterpreter only Reference(ClinicalScientist)
* specimen 1..*
* specimen only Reference(GenomicsSpecimen)
* status = #final
* subject 1..1
* subject MS SU
* subject only Reference(GenomicsPatient)


Instance: JamesPondDiagnosticReport
InstanceOf: GenomicsDiagnosticReport
Description: "An example of a diagnostic report for James Pond"
* code = $PANEL_APP#R184
* effectiveDateTime = "2022-01-06T14:00:00Z"
* issued = "2022-01-06T13:00:00Z"
* performer = Reference(GoshOrganization)
* result = Reference(CysticFibrosisVariant)
* resultsInterpreter[+] = Reference(AnaClinicalScientist)
* resultsInterpreter[+] = Reference(JanePrincipleScientist)
* specimen = Reference(JamesPondSpecimen)
* status = #final
* subject = Reference(JamesPond)
