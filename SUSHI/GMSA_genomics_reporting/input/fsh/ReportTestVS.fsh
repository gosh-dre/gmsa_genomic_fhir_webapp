Alias: $LOINC = http://loinc.org

ValueSet : ReportTestVS
Id: gosh-zygosity-valueset
Title: "The codes for zygosity in genomic report"
Description: "Values for zygosity in genomic report files"
* ^status = #draft
* include codes from valueset $LOINC
* include codes from system $LOINC where concept is-a #53034-5
* include codes from system http://loinc.org
* $LOINC#LA6706-1 "Heterozygous"
* $LOINC#LA6703-8 "Heteroplasmic"
* $LOINC#LA6707-9 "Hemizygous"
* $LOINC#LA6704-6 "Homoplasmic"
* $LOINC#LA6705-3 "Homozygous"