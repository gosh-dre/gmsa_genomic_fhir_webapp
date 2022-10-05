Profile: GenomicsReferral
Parent: ServiceRequest
Id: GenomicsReferral
Description: "A GOSH profile of patient referral for genomic testing"
* category = $SCT#108252007
* instantiatesCanonical 1..1
* instantiatesCanonical only Reference(PlanDefinition)
* intent = "order"
* performer only Reference(Practitioner)
* performerType = $SCT#310049001
* reasonCode 1..*
* reasonCode from GenomicDiseases
* specimen 1..*
* specimen only Reference(Specimen)
* status = "active"
* subject 1..1
* subject MS SU
* subject only Reference(Patient)


Instance: CysticFibrosisReferral
InstanceOf: GenomicsReferral
Description: "An example of a patient"
* category = $SCT#108252007
* instantiatesCanonical = Reference(Practitioner)
* intent = "order"
* performer[+] = Reference(Practitioner)
* performer[+] = Reference(Practitioner)
* reasonCode = $PANEL_APP#R184
* specimen = Reference(Specimen)
* status = "active"
* subject = Reference(JamesPond)

