import { ValueSet, ValueSetComposeIncludeConcept } from "fhir/r4";
import { Buffer } from "buffer";
import fetch from "node-fetch";

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

export type LoincOption = { code: string; display: string };

export const variantCodes = async () => {
  return {
    classification: await getValueSetData("LL4034-6"),
    inheritance: await getValueSetData("LL3731-8"),
    zygosity: await getValueSetData("LL381-5"),
    followUp: await getValueSetData("LL1037-2"),
  };
};

const getValueSetData = async (valueSet: string): Promise<ValueSet> => {
  const url = `/loinc/ValueSet/${valueSet}`;
  const response = await fetch(url, requestInit);

  if (!response.ok) {
    throw new Error(`Failed to get loinc ${valueSet}`);
  }
  return await response.json();
};

export const getValues = (valueSet: ValueSet): LoincOption[] => {
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

const isConcept = (concept: ValueSetComposeIncludeConcept | undefined): concept is ValueSetComposeIncludeConcept => {
  return !!concept;
};

const makeLoincOption = (concept: ValueSetComposeIncludeConcept): LoincOption => {
  return { code: concept.code, display: concept.display || concept.code };
};
