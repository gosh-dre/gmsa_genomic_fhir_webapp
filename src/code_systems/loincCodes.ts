import { ValueSet } from "@smile-cdr/fhirts/dist/FHIR-R4/classes/models-r4";
import { getSelectOptions } from "./loinc";
import { RequiredCoding } from "./types";

type LoincCodes = {
  classification: ValueSet;
  inheritance: ValueSet;
  zygosity: ValueSet;
  reportFinding: ValueSet;
  followUp: ValueSet;
};

/**
 * Combined FHIR ValueSet response for loinc codes to be used in form drop-downs.
 */
export const loincCodes: LoincCodes = {
  classification: {
    resourceType: "ValueSet",
    id: "LL4034-6",
    meta: {
      versionId: "8",
      lastUpdated: "2022-04-11T20:59:39.512+00:00",
    },
    url: "http://loinc.org/vs/LL4034-6",
    identifier: [
      {
        system: "urn:ietf:rfc:3986",
        value: "urn:oid:1.3.6.1.4.1.12009.10.1.2644",
      },
    ],
    version: "Loinc_2.72",
    name: "ACMG_Clinical significance of genetic variation",
    status: "active",
    publisher: "Regenstrief Institute, Inc.",
    contact: [
      {
        name: "Regenstrief Institute, Inc.",
        telecom: [
          {
            system: "url",
            value: "https://loinc.org",
          },
        ],
      },
    ],
    copyright:
      "This material contains content from LOINC (http://loinc.org). LOINC is copyright ©1995-2022, Regenstrief Institute, Inc. and the Logical Observation Identifiers Names and Codes (LOINC) Committee and is available at no cost under the license at http://loinc.org/license. LOINC® is a registered United States trademark of Regenstrief Institute, Inc.",
    compose: {
      include: [
        {
          system: "http://loinc.org",
          concept: [
            {
              code: "LA6668-3",
              display: "Pathogenic",
            },
            {
              code: "LA26332-9",
              display: "Likely pathogenic",
            },
            {
              code: "LA26333-7",
              display: "Uncertain significance",
            },
            {
              code: "LA26334-5",
              display: "Likely benign",
            },
            {
              code: "LA6675-8",
              display: "Benign",
            },
          ],
        },
      ],
    },
  },
  inheritance: {
    resourceType: "ValueSet",
    id: "LL3731-8",
    meta: {
      versionId: "8",
      lastUpdated: "2022-04-11T20:51:57.800+00:00",
    },
    url: "http://loinc.org/vs/LL3731-8",
    identifier: [
      {
        system: "urn:ietf:rfc:3986",
        value: "urn:oid:1.3.6.1.4.1.12009.10.1.2368",
      },
    ],
    version: "Loinc_2.72",
    name: "[NEI] Inheritance pattern from family history",
    status: "active",
    publisher: "Regenstrief Institute, Inc.",
    contact: [
      {
        name: "Regenstrief Institute, Inc.",
        telecom: [
          {
            system: "url",
            value: "https://loinc.org",
          },
        ],
      },
    ],
    copyright:
      "This material contains content from LOINC (http://loinc.org). LOINC is copyright ©1995-2022, Regenstrief Institute, Inc. and the Logical Observation Identifiers Names and Codes (LOINC) Committee and is available at no cost under the license at http://loinc.org/license. LOINC® is a registered United States trademark of Regenstrief Institute, Inc.",
    compose: {
      include: [
        {
          system: "http://loinc.org",
          concept: [
            {
              code: "LA24640-7",
              display: "Autosomal dominant",
            },
            {
              code: "LA24641-5",
              display: "Autosomal recessive",
            },
            {
              code: "LA24789-2",
              display: "Mitochondrial",
            },
            {
              code: "LA24949-2",
              display: "Isolated",
            },
            {
              code: "LA24947-6",
              display: "X-linked",
            },
            {
              code: "LA24812-2",
              display: "No family history of disease and no other systemic findings",
            },
            {
              code: "LA46-8",
              display: "Other",
            },
            {
              code: "LA21413-2",
              display: "No information",
            },
            {
              code: "LA4720-4",
              display: "Not applicable",
            },
            {
              code: "LA24722-3",
              display: "Family history is unknown or not recorded",
            },
          ],
        },
      ],
    },
  },
  zygosity: {
    resourceType: "ValueSet",
    id: "LL381-5",
    meta: {
      versionId: "8",
      lastUpdated: "2022-04-11T20:54:21.492+00:00",
    },
    url: "http://loinc.org/vs/LL381-5",
    identifier: [
      {
        system: "urn:ietf:rfc:3986",
        value: "urn:oid:1.3.6.1.4.1.12009.10.1.2460",
      },
    ],
    version: "Loinc_2.72",
    name: "MG_5_Genetic variant allelic state",
    status: "active",
    publisher: "Regenstrief Institute, Inc.",
    contact: [
      {
        name: "Regenstrief Institute, Inc.",
        telecom: [
          {
            system: "url",
            value: "https://loinc.org",
          },
        ],
      },
    ],
    copyright:
      "This material contains content from LOINC (http://loinc.org). LOINC is copyright ©1995-2022, Regenstrief Institute, Inc. and the Logical Observation Identifiers Names and Codes (LOINC) Committee and is available at no cost under the license at http://loinc.org/license. LOINC® is a registered United States trademark of Regenstrief Institute, Inc.",
    compose: {
      include: [
        {
          system: "http://loinc.org",
          concept: [
            {
              code: "LA6703-8",
              display: "Heteroplasmic",
            },
            {
              code: "LA6704-6",
              display: "Homoplasmic",
            },
            {
              code: "LA6705-3",
              display: "Homozygous",
            },
            {
              code: "LA6706-1",
              display: "Heterozygous",
            },
            {
              code: "LA6707-9",
              display: "Hemizygous",
            },
          ],
        },
      ],
    },
  },
  reportFinding: {
    resourceType: "ValueSet",
    id: "LL2431-6-2.73",
    meta: {
      versionId: "1",
      lastUpdated: "2022-08-08T12:57:53.978+00:00",
    },
    url: "http://loinc.org/vs/LL2431-6",
    identifier: [
      {
        system: "urn:ietf:rfc:3986",
        value: "urn:oid:1.3.6.1.4.1.12009.10.1.1595",
      },
    ],
    version: "Loinc_2.73-2.73",
    name: "Pos|Neg|Inconcl",
    status: "active",
    publisher: "Regenstrief Institute, Inc.",
    contact: [
      {
        name: "Regenstrief Institute, Inc.",
        telecom: [
          {
            system: "url",
            value: "https://loinc.org",
          },
        ],
      },
    ],
    copyright:
      "This material contains content from LOINC (http://loinc.org). LOINC is copyright ©1995-2022, Regenstrief Institute, Inc. and the Logical Observation Identifiers Names and Codes (LOINC) Committee and is available at no cost under the license at http://loinc.org/license. LOINC® is a registered United States trademark of Regenstrief Institute, Inc.",
    compose: {
      include: [
        {
          system: "http://loinc.org",
          version: "2.73",
          concept: [
            {
              code: "LA6576-8",
              display: "Positive",
            },
            {
              code: "LA6577-6",
              display: "Negative",
            },
            {
              code: "LA9663-1",
              display: "Inconclusive",
            },
          ],
        },
      ],
    },
  },
  followUp: {
    resourceType: "ValueSet",
    id: "LL1037-2",
    meta: {
      versionId: "8",
      lastUpdated: "2022-04-11T20:12:27.386+00:00",
    },
    url: "http://loinc.org/vs/LL1037-2",
    identifier: [
      {
        system: "urn:ietf:rfc:3986",
        value: "urn:oid:1.3.6.1.4.1.12009.10.1.206",
      },
    ],
    version: "Loinc_2.72",
    name: "Genetic recommendation",
    status: "active",
    publisher: "Regenstrief Institute, Inc.",
    contact: [
      {
        name: "Regenstrief Institute, Inc.",
        telecom: [
          {
            system: "url",
            value: "https://loinc.org",
          },
        ],
      },
    ],
    copyright:
      "This material contains content from LOINC (http://loinc.org). LOINC is copyright ©1995-2022, Regenstrief Institute, Inc. and the Logical Observation Identifiers Names and Codes (LOINC) Committee and is available at no cost under the license at http://loinc.org/license. LOINC® is a registered United States trademark of Regenstrief Institute, Inc.",
    compose: {
      include: [
        {
          system: "http://loinc.org",
          concept: [
            {
              code: "LA14020-4",
              display: "Genetic counseling recommended",
            },
            {
              code: "LA14021-2",
              display: "Confirmatory testing recommended",
            },
            {
              code: "LA14022-0",
              display: "Additional testing recommended",
            },
          ],
        },
      ],
    },
  },
};

export const loincResources = Object.values(loincCodes).map((vs) => {
  const identifier = vs.identifier?.at(0)?.value as string;
  return { resource: vs, identifier: identifier };
});

/**
 * LOINC codes for form drop-downs.
 *
 * Hardcoded to ensure that we control when changes are rolled out to LOINC codes.
 */
export const loincSelect = {
  classification: getSelectOptions(loincCodes.classification),
  inheritance: getSelectOptions(loincCodes.inheritance),
  zygosity: getSelectOptions(loincCodes.zygosity),
  reportFinding: getSelectOptions(loincCodes.reportFinding),
  followUp: getSelectOptions(loincCodes.followUp),
};

/**
 * Function to extract entire FHIR Coding object from an array of possible objects.
 * @param options all drop down options
 * @param id code from the FHIR Coding object
 */
export const codedValue = (options: RequiredCoding[], id: string): RequiredCoding => {
  const codingValue = options.filter((opt) => opt.code === id).pop();
  if (!codingValue) {
    throw new ReferenceError(`Could not find ${id} in coded values`);
  }
  return codingValue;
};
