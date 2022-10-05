Alias: $LOINC = http://loinc.org
Alias: $NCBI = https://www.ncbi.nlm.nih.gov/refseq
Alias: $HGVS = http://varnomen.hgvs.org
Alias: $GeneNames = http://www.genenames.org/geneId
Alias: $genenames = http://www.genenames.org

// Inspired by http://www.hl7.org/fhir/us/core/StructureDefinition-us-core-blood-pressure.html

Profile: VariantDetailProfile
Parent: Observation
Title: "Variant detail"
Description: "An example variant detail"
* code = $LOINC#69548-6

* subject only Reference(Patient)
* subject MS SU
* specimen only Reference(Specimen)
* performer only Reference(Practitioner)

// Step 1: Define the slicing logic
* component ^slicing.discriminator.type = #pattern  // or #value, #profile
* component ^slicing.discriminator.path = "code"    // any FHIRPath expression
* component ^slicing.rules = #open    // additional elements are ok
* component ^slicing.ordered = false  // by default, array elements in any order
* component ^slicing.description = "Slice pattern for component.code"  // optional

// Step 2: Identify the slices
* component contains
    TranscriptReferenceSeqID 1..1 and  // each slice is identified by name, card, & optional flags
    DNAchange 1..1 and // using "and" to separate each slice identification
    AminoAcidChange 1..1 and
    Zygosity 1..1 and
    ClinicalSignificance 1..1 and
    InherianceFamily 1..1 and
    ConfirmedVariant 1..1 and
    GeneNames 1..1 

// Step 3: Define each slice: TranscriptReferenceSeqID
* component[TranscriptReferenceSeqID].code = $LOINC#51958-7  // LOINC#51958-7 distinguishes the slice
* component[TranscriptReferenceSeqID].value[x] only CodeableConcept
* component[TranscriptReferenceSeqID].ValueCodeableConcept = $NCBI#NM_006306.3

// Step 4: Define each slice: DNAchange
* component[DNAchange].code = $LOINC#48004-6 // LOINC#48004-6 distinguishes the slice
* component[DNAchange].value[x] only CodeableConcept
* component[DNAchange].ValueCodeableConcept = $HGVS#c.1263del

// Step 5: Define each slice: AminoAcidChange
* component[AminoAcidChange].code = $LOINC#48005-3 // LOINC#48005-3 distinguishes the slice
* component[AminoAcidChange].value[x] only CodeableConcept
* component[AminoAcidChange].ValueCodeableConcept = $HGVS#p.(Lys422Serfs*28)

// Step 5: Define each slice: Zygosity
* component[Zygosity].code = $LOINC#53034-5 // LOINC#53034-5 distinguishes the slice
* component[Zygosity].value[x] only CodeableConcept
* component[Zygosity].ValueCodeableConcept from ReportTestVS (required)
// * component[Zygosity].ValueCodeableConcept = $LOINC#LA6706-1

* component[ClinicalSignificance].code = $LOINC#53037-8
* component[ClinicalSignificance].value[x] only CodeableConcept
* component[ClinicalSignificance].ValueCodeableConcept from SignificanceVS (required)
// * component[ClinicalSignificance].ValueCodeableConcept = $LOINC#LA6668-3

* component[InherianceFamily].code = $LOINC#53034-0
* component[InherianceFamily].value[x] only CodeableConcept
* component[InherianceFamily].ValueCodeableConcept from InheritanceVS (required)
// * component[InherianceFamily].ValueCodeableConcept = $LOINC#LA24947-6

* component[ConfirmedVariant].code = $confirmed-variant#1
* component[ConfirmedVariant].value[x] only boolean
* component[ConfirmedVariant].ValueBoolean = true

* component[GeneNames].code = $GeneNames#HGNC:11111
* component[GeneNames].value[x] only string
* component[GeneNames].ValueString from HGNCVS (required)
* include codes from valueset http://hl7.org/fhir/ValueSet/genenames
* include codes from system http://fhir.nmdp.org/ig/hla-reporting/ValueSet/hla-geneid-valueset

ValueSet: HGNCVS
Id: genenames
Title: "H g n c"
Description: "HGNC: Human Gene Nomenclature Committee"
* ^meta.lastUpdated = "2019-11-01T09:29:23.356+11:00"
* ^meta.profile = "http://hl7.org/fhir/StructureDefinition/shareablevalueset"
* ^extension.url = "http://hl7.org/fhir/StructureDefinition/structuredefinition-wg"
* ^extension.valueCode = #oo
* ^identifier.system = "urn:ietf:rfc:3986"
* ^identifier.value = "urn:oid:2.16.840.1.113883.6.281"
* ^version = "4.0.1"
* ^status = #draft
* ^experimental = false
* ^date = "2019-11-01T09:29:23+11:00"
* ^publisher = "HL7 International - FHIR-Infrastructure"
* ^contact.telecom.system = #url
* ^contact.telecom.value = "http://hl7.org/fhir"
* include codes from system $genenames






