import { Buffer } from "buffer";
import fetch from "node-fetch";
import { ValueSet, ValueSetConcept } from "@smile-cdr/fhirts/dist/FHIR-R4/classes/models-r4";
import { RequiredCoding } from "./types";

const USERNAME = process.env.REACT_APP_LOINC_USERNAME;
const PASSWORD = process.env.REACT_APP_LOINC_PASSWORD;
const AUTH = Buffer.from(`${USERNAME}:${PASSWORD}`).toString("base64");

const requestInit = {
  method: "GET",
  headers: {
    "Content-type": "application/json",
    _format: "json",
    Authorization: `Basic ${AUTH}`,
  },
};

export const variantCodes = async () => {
  return {
    classification: await getValueSetData("LL4034-6"),
    inheritance: await getValueSetData("LL3731-8"),
    zygosity: await getValueSetData("LL381-5"),
    reportFinding: await getValueSetData("LL2431-6"),
    followUp: await getValueSetData("LL1037-2"),
  };
};

const getValueSetData = async (valueSet: string): Promise<ValueSet> => {
  const url = `https://fhir.loinc.org/ValueSet/${valueSet}`;
  const response = await fetch(url, requestInit);

  if (!response.ok) {
    console.error(response.body);
    throw new Error(`Failed to get loinc ${valueSet}, maybe check your loinc credentials in the .env file`);
  }
  return await response.json();
};

/**
 * Parse ValueSet to output the FHIR Coding objects that are available
 * @param valueSet FHIR ValueSet
 */
export const getSelectOptions = (valueSet: ValueSet): RequiredCoding[] => {
  const unpacked = valueSet.compose?.include
    ?.flatMap((c) => c.concept)
    .filter(isConcept)
    .flatMap((c) => makeLoincOption(c));

  if (unpacked === undefined) {
    return [];
  } else {
    return unpacked;
  }
};

const isConcept = (concept: ValueSetConcept | undefined): concept is ValueSetConcept => {
  return !!concept;
};

const makeLoincOption = (concept: ValueSetConcept): RequiredCoding => {
  return <RequiredCoding>{
    code: concept.code,
    display: concept.display || concept.code,
    system: "http://loinc.org",
  };
};
