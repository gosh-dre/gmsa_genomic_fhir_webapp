Alias: $sct = http://snomed.info/sct

Profile: ReferralReasonProfile
Parent: ServiceRequest
Id: gosh-servicerequest-profile
Title: "Referal Reason"
Description: "A GOSH profile describing reason for referring patient to hospital"
* category = http://snomed.info#108252007
* subject only Reference(Patient)
* subject MS SU
* subject 1..1
* supportingInfo only Reference(PlanDefinition)
* supportingInfo 1..1

* reasonCode = $sct#230387008
* reasonCode from ServiceRequestVS (required)

ValueSet : ServiceRequestVS
Description: "Values describing reason for referring Patients"
* include codes from valueset http://hl7.org/fhir/ValueSet/gost-service-requests
* include $sct#82511000000108
