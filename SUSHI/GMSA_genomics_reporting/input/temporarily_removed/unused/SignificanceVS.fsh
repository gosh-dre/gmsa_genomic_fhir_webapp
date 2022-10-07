ValueSet : SignificanceVS
Id: gosh-significance-valueset
Title: "The codes for clinical significance in genomic report"
Description: "Values for clinical significance in genomic report files"
* ^status = #draft
* include codes from valueset $LOINC
* include codes from system $LOINC where concept is-a #53037-8
* include codes from system http://loinc.org
* $LOINC#LA6675-8 "Benign"
* $LOINC#LA26334-5 "Likely benign"
* $LOINC#LA26332-9 "Likely pathogenic"
* $LOINC#LA6668-3 "Pathogenic"
* $LOINC#LA26333-7 "Uncertain significance"
