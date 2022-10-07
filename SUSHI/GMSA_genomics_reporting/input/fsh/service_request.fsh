Profile: GenomicsReferral
Parent: ServiceRequest
Id: GenomicsReferral
Description: "A GOSH profile of patient referral for genomic testing"
* category = $SCT#108252007
* instantiatesCanonical 1..1
* instantiatesCanonical only Canonical(GenomicsTestMetadata)
* intent = #order
* performer only Reference(ClinicalScientist)
* performerType = $SCT#310049001
* reasonCode 1..*
* reasonCode from GenomicDiseases
* specimen 1..*
* specimen only Reference(GenomicsSpecimen)
* status = #active
* subject 1..1
* subject MS SU
* subject only Reference(GenomicsPatient)


Instance: CysticFibrosisReferral
InstanceOf: GenomicsReferral
Description: "An example of a patient"
* category = $SCT#108252007
* instantiatesCanonical = Canonical(JamesPondTestMetadata)
* intent = #order
* performer[+] = Reference(AnaClinicalScientist)
* performer[+] = Reference(JanePrincipleScientist)
* reasonCode = $PANEL_APP#R184
* specimen = Reference(JamesPondSpecimen)
* status = #active
* subject = Reference(JamesPond)

