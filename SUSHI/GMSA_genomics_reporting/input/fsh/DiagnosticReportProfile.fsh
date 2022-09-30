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

ValueSet : DiagnosticReportVS
Id: test-name-valueset
Title: "The codes for test names in genomic report"
Description: "Values for test names in PanelApp"
* ^status = #draft
* include codes from valueset $PANEL_APP
* include codes from system $PANEL_APP where concept is-a #R1234
* include codes from system $PANEL_APP
* $PANEL_APP#R14 "Acutely unwell children with a likely monogenic disorder"
* $PANEL_APP#R137 "Congenital heart disease - microarray"
* $PANEL_APP#R127 "Long QT syndrome"
* $PANEL_APP#R128 "Brugada syndrome and cardiac sodium channel disease"
* $PANEL_APP#R129 "Catecholaminergic polymorphic VT"
* $PANEL_APP#R130 "Short QT syndrome"
* $PANEL_APP#R131 "Hypertrophic cardiomyopathy"
* $PANEL_APP#R184 "Cystic fibrosis diagnostic test"
* $PANEL_APP#R185 "Cystic fibrosis carrier testing"
* $PANEL_APP#R59 "Early onset or syndromic epilepsy"
* $PANEL_APP#R226 "Inherited parathyroid cancer"
* $PANEL_APP#R207 "Inherited ovarian cancer (without breast cancer)"
* $PANEL_APP#R211 "Inherited polyposis and early onset colorectal cancer - germline testing"
* $PANEL_APP#R215 "CDH1-related cancer syndrome"
* $PANEL_APP#R404 "Testing of unaffected individuals for inherited cancer predisposition syndromes"
* $PANEL_APP#R224 "Inherited renal cancer"
* $PANEL_APP#R364 "DICER1-related cancer predisposition"
* $PANEL_APP#R367 "Inherited pancreatic cancer"
* $PANEL_APP#R193 "Cystic renal disease"
* $PANEL_APP#R173 "Polycystic liver disease"
* $PANEL_APP#R65 "Aminoglycoside exposure posing risk to hearing"
* $PANEL_APP#R298 "Possible structural or mosaic chromosomal abnormality - FISH"
* $PANEL_APP#R297 "Possible structural chromosomal rearrangement - karyotype"
* $PANEL_APP#R265 "Chromosomal mosaicism - karyotype"
* $PANEL_APP#R27 "Congenital malformation and dysmorphism syndromes - microarray and sequencing"
* $PANEL_APP#R28 "Congenital malformation and dysmorphism syndromes - microarray only"
* $PANEL_APP#R29 "Intellectual disability - microarray and sequencing"
* $PANEL_APP#R377 "Intellectual disability - microarray only"
* $PANEL_APP#R343 "Chromosomal mosaicism - microarray"
