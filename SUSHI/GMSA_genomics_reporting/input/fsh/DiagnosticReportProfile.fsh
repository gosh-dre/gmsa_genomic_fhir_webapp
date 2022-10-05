Profile: DiagnosticReportProfile
Parent: DiagnosticReport
Id: gosh-report-Profile
Description: "An example profile for collecting diagnostic report test type with PanelApp, authorised and reported time of the report"
* code = $PANEL_APP#R59
* code from DiagnosticReportVS (required)
* conclusionCode = $LOINC#1
* subject only Reference(Patient)
* subject MS SU
* specimen only Reference(Specimen)
* resultsInterpreter only Reference(Practitioner)
* result only Reference(Observation)
* effective[x] only dateTime
* issued only instant
