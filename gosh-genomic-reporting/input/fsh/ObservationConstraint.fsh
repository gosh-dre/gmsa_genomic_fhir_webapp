Invariant: gosh-o-path
Severity: #error
Description: "Shall at least contain an MRN or family number or a reference to an organization"
Expression: "(component.empty() and hasMember.empty()) implies (dataAbsentReason.exists() or value.exists())"
XPath: "exists(c:code) or exists(c:value) or exists(c:codeableconcept)"

Profile: ObservationWithComponentInvariant
Id: gosh-observation-w-component-invariant
Parent: Observation
* component obeys gosh-o-path