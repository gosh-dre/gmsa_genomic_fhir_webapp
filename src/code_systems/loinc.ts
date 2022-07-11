import axios from "axios";
import { ValueSet, ValueSetComposeIncludeConcept } from "fhir/r4";

const USERNAME = process.env.REACT_APP_LOINC_USERNAME || "not set";
const PASSWORD = process.env.REACT_APP_LOINC_PASSWORD || "not set";

export const zygosity = async (): Promise<ValueSet> => {
  return await getValueSetData("LL381-5");
};

const getValueSetData = async (valueSet: string): Promise<ValueSet> => {
  const url = `https://fhir.loinc.org/ValueSet/${valueSet}`;
  const response = await axios(url, {
    method: "GET",
    headers: { _format: "json" },
    auth: { username: USERNAME, password: PASSWORD },
  });
  return await response.data;
};

export const getValues = (valueSet: ValueSet): ValueSetComposeIncludeConcept[] => {
  const unpacked = valueSet.compose?.include?.flatMap((c) => c.concept).filter(isConcept);
  if (unpacked === undefined) {
    return [];
  } else {
    return unpacked;
  }
};

const isConcept = (concept: ValueSetComposeIncludeConcept | undefined): concept is ValueSetComposeIncludeConcept => {
  return !!concept;
};
