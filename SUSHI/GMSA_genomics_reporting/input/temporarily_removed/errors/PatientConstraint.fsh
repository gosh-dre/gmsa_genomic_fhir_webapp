Invariant: gosh-o-path
Severity: #error
Description: "If there is no component or hasMember element then either a value[x] or a data absent reason must be present"
Expression: "(component.empty() and hasMember.empty()) implies (dataAbsentReason.exists() or value.exists())"
XPath: "exists(f:component) or exists(f:hasMember) or exists(f:*[starts-with(local-name(.), 'value')]) or exists(f:dataAbsentReason)"

Profile: ObservationWithComponentInvariant
Id: gosh-observation-w-component-invariant
Parent: Observation
* component obeys gosh-o-path

Invariant: gosh-path
Severity: #error
Description: "Shall at least contain an MRN or family number or a reference to an organization"
Expression: "name.exist() or indentifier.exists() or organization.exists()"
XPath: "exists(f:name) or exists(f:identifier) or exists(f:organization)"

Profile: PatientWithIdentifierInvariant
Id: gosh-patient-w-identifier-invariant
Parent: Patient
* identifier obeys gosh-path