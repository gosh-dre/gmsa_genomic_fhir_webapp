Profile: GenomicsOrganization
Parent: Organization
Id: GenomicsOrganization
Description: "Organization for genomics report"
* active = true
* name MS
* address 1..1 MS
* address.line 1..* MS
* address.city MS
* address.postalCode MS
* address.country MS

Instance: GoshOrganization
InstanceOf: GenomicsOrganization
Description: "GOSH genomics laboratory"
* active = true
* name = "Great Ormond Street Hospital for Children NHS Foundation Trust"
* address
  * line[0] = "Level 4 Barclays House"
  * line[1] = "37 Queens Square"
  * city = "London"
  * postalCode = "WC1N 3BH"
  * country = "United Kingdom"
