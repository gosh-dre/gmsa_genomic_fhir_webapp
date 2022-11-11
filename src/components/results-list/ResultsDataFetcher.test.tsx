import { Fhir } from "fhir/fhir";
import { Bundle } from "@smile-cdr/fhirts/dist/FHIR-R4/classes/bundle";
import { BundleEntry } from "@smile-cdr/fhirts/dist/FHIR-R4/classes/bundleEntry";
import { Patient } from "@smile-cdr/fhirts/dist/FHIR-R4/classes/models-r4";
import { render } from "@testing-library/react";
import ResultsList from "./ResultsList";
import { initialValues } from "../reports/FormDefaults";
import { createBundle } from "../../fhir/api";
import { deleteFhirData, sendBundle } from "../../fhir/testUtilities";
import ResultsDataFetcher from "./ResultsDataFetcher";
import { geneCoding } from "../../code_systems/hgnc";

const fhir = new Fhir();

const reportedGenes = [geneCoding("HGNC:4389", "GNA01")];

jest.setTimeout(20000);

const generateNumber = (type?: string) => {
  let num;
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const randomCharacter = characters[Math.floor(Math.random() * characters.length)];

  if (type === "nhs") {
    num = Math.floor(Math.random() * Math.pow(10, 10));
  }
  if (type === "family") {
    num = randomCharacter + Math.floor(Math.random() * Math.pow(10, 6));
  }
  if (type === "reason") {
    num = randomCharacter + Math.floor(Math.random() * Math.pow(10, 2));
  }
  // for mrn
  num = Math.floor(Math.random() * Math.pow(10, 8));
  return num.toString();
};

type changeableValues = {
  patient: {
    mrn: string;
    nhsNumber: string;
    firstName: string;
    lastName: string;
    familyNumber: string;
  };
  sample: {
    specimenCode: string;
    reasonForTest: string;
  };
  variant: {
    cDnaHgvs: string;
  };
};

const p1Values = {
  patient: {
    mrn: generateNumber(),
    nhsNumber: generateNumber("nhs"),
    firstName: "FirstOne",
    lastName: "LastOne",
    familyNumber: generateNumber("family"),
  },
  sample: { specimenCode: "84KS-638L3748", reasonForTest: generateNumber("reason") },
  variant: {
    cDnaHgvs: "c.474K>T",
  },
};

const p2Values = {
  patient: {
    mrn: generateNumber(),
    nhsNumber: generateNumber("nhs"),
    firstName: "FirstTwo",
    lastName: "LastTwo",
    familyNumber: generateNumber("family"),
  },
  sample: {
    specimenCode: "18HS-268L8837",
    reasonForTest: generateNumber("reason"),
  },
  variant: {
    cDnaHgvs: "c.019D>T",
  },
};
const p3Values = {
  patient: {
    mrn: generateNumber(),
    nhsNumber: generateNumber("nhs"),
    firstName: "FirstThree",
    lastName: "LastThree",
    familyNumber: generateNumber("family"),
  },
  sample: {
    specimenCode: "88US-638L2488",
    reasonForTest: generateNumber("reason"),
  },
  variant: {
    cDnaHgvs: "c.716G>T",
  },
};
const p4Values = {
  patient: {
    mrn: generateNumber(),
    nhsNumber: generateNumber("nhs"),
    firstName: "FirstFour",
    lastName: "LastFour",
    familyNumber: generateNumber("family"),
  },
  sample: {
    specimenCode: "81GD-617L5358",
    reasonForTest: generateNumber("reason"),
  },
  variant: {
    cDnaHgvs: "c.286G>T",
  },
};
const p5Values = {
  patient: {
    mrn: generateNumber(),
    nhsNumber: generateNumber("nhs"),
    firstName: "FirstFive",
    lastName: "LastFive",
    familyNumber: generateNumber("family"),
  },
  sample: {
    specimenCode: "68DH-610H8448",
    reasonForTest: generateNumber("reason"),
  },
  variant: {
    cDnaHgvs: "c.738J>T",
  },
};

const changePatientInfo = (valuesToUpdate: changeableValues) => {
  const newPatient = { ...initialValues };
  newPatient.patient.mrn = valuesToUpdate.patient.mrn;
  newPatient.patient.familyNumber = valuesToUpdate.patient.familyNumber;
  newPatient.patient.nhsNumber = valuesToUpdate.patient.nhsNumber;
  newPatient.patient.firstName = valuesToUpdate.patient.firstName;
  newPatient.patient.lastName = valuesToUpdate.patient.lastName;
  newPatient.sample.specimenCode = valuesToUpdate.sample.specimenCode;
  newPatient.sample.reasonForTest = valuesToUpdate.sample.reasonForTest;
  newPatient.variant[0].cDnaHgvs = valuesToUpdate.variant.cDnaHgvs;
  return newPatient;
};

const create5Patients = async () => {
  const p1 = createBundle(changePatientInfo(p1Values), reportedGenes);
  const p2 = createBundle(changePatientInfo(p2Values), reportedGenes);
  const p3 = createBundle(changePatientInfo(p3Values), reportedGenes);
  const p4 = createBundle(changePatientInfo(p4Values), reportedGenes);
  const p5 = createBundle(changePatientInfo(p5Values), reportedGenes);
  await sendBundle(p1);
  await sendBundle(p2);
  await sendBundle(p3);
  await sendBundle(p4);
  await sendBundle(p5);
};

describe("Results table", () => {
  beforeEach(() => {
    return deleteFhirData();
  });

  test("patients are in table", async () => {
    create5Patients();
    render(<ResultsDataFetcher />);
    // expect("entry" in patientData).toBeTruthy();
    // expect(getPatientIdentifier(patientData)).toEqual(initialValues.patient.mrn);
  });
});
