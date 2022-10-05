ValueSet : InheritanceVS
Id: gosh-inheritance-valueset
Title: "The codes for inheritance based on family history in genomic report"
Description: "Values for inheritance based on family history in genomic report files"
* ^status = #draft
* include codes from valueset $LOINC
* include codes from system $LOINC where concept is-a #79742-3
* include codes from system $LOINC
* $LOINC#LA24640-7 "Autosomal dominant"
* $LOINC#LA24641-5 "Autosomal recessive"
* $LOINC#LA24722-3 "Family history is unknown or not recorded"
* $LOINC#LA24949-2 "Isolated"
* $LOINC#LA24789-2 "Mitochondrial"
* $LOINC#LA24812-2 "No family history of disease and no other systemic findings"
* $LOINC#LA21413-2 "No information"
* $LOINC#LA4720-4 "Not applicable"
* $LOINC#LA46-8 "Other"
* $LOINC#LA24947-6 "X-linked"
