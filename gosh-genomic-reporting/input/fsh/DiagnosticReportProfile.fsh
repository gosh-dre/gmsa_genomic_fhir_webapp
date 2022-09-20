Alias: $loinc = http://loinc.org
// Alias: $sct = http://snomed.info/sct
Alias: $panel = http://panelapp.org

Profile: DiagnosticReportProfile
Parent: DiagnosticReport
Id: gosh-report-Profile
Description: "An example profile for collecting diagnostic report test type with PanelApp, authorised and reported time of the report"
* code = http://panelapp.org#R59
* code from DiagnosticReportVS (required)
* conclusionCode = $loinc#1
* subject only Reference(Patient)
* subject MS SU
* specimen only Reference(Specimen)
* resultsInterpreter only Reference(Practitioner)
* result only Reference(Observation)
* effective[x] only dateTime
* issued only instant

ValueSet : DiagnosticReportVS
Id: test-name-valueset
Title: "The codes for test names in genomic report"
Description: "Values for test names in PanelApp"
* ^status = #draft
* include codes from valueset $panel
* include codes from system $panel where concept is-a #R1234
* include codes from system http://panelapp.org
* $panel#R14 "Acutely unwell children with a likely monogenic disorder"
* $panel#R137 "Congenital heart disease - microarray"
* $panel#R127 "Long QT syndrome"
* $panel#R128 "Brugada syndrome and cardiac sodium channel disease"
* $panel#R129 "Catecholaminergic polymorphic VT"
* $panel#R130 "Short QT syndrome"
* $panel#R131 "Hypertrophic cardiomyopathy"
* $panel#R184 "Cystic fibrosis diagnostic test"
* $panel#R185 "Cystic fibrosis carrier testing"
* $panel#R59 "Early onset or syndromic epilepsy"
* $panel#R226 "Inherited parathyroid cancer"
* $panel#R207 "Inherited ovarian cancer (without breast cancer)"
* $panel#R211 "Inherited polyposis and early onset colorectal cancer - germline testing"
* $panel#R215 "CDH1-related cancer syndrome"
* $panel#R404 "Testing of unaffected individuals for inherited cancer predisposition syndromes"
* $panel#R224 "Inherited renal cancer"
* $panel#R364 "DICER1-related cancer predisposition"
* $panel#R367 "Inherited pancreatic cancer"
* $panel#R193 "Cystic renal disease"
* $panel#R173 "Polycystic liver disease"
* $panel#R65 "Aminoglycoside exposure posing risk to hearing"
* $panel#R298 "Possible structural or mosaic chromosomal abnormality - FISH"
* $panel#R297 "Possible structural chromosomal rearrangement - karyotype"
* $panel#R265 "Chromosomal mosaicism - karyotype"
* $panel#R27 "Congenital malformation and dysmorphism syndromes - microarray and sequencing"
* $panel#R28 "Congenital malformation and dysmorphism syndromes - microarray only"
* $panel#R29 "Intellectual disability - microarray and sequencing"
* $panel#R377 "Intellectual disability - microarray only"
* $panel#R343 "Chromosomal mosaicism - microarray"