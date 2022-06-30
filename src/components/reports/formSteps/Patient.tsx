import { FC, useState } from "react";

import LabSelect from "../../UI/LabSelect";
import FieldSet from "../FieldSet";
import FormStepBtn from "../../UI/FormStepBtn";

interface Props {
  nextStep: () => void;
  prevStep: () => void;
  setFieldValue: (field: string, value: string | string[]) => void;
}

const Patient: FC<Props> = (props) => {
  const [selectedLab, setSelectedLab] = useState("please select a lab");

  const { nextStep, prevStep, setFieldValue } = props;

  const setSelectedLabHandler = (lab: string) => {
    if (lab === "gosh") {
      setFieldValue("address.streetAddress", [
        "Great Ormond Street Hospital for Children NHS Foundation Trust",
        "Levels 4-6 Barclay House",
        "37 Queen Square",
      ]);
      setFieldValue("address.city", "London");
      setFieldValue("address.postCode", "WC1N 3BH");
      setFieldValue("address.country", "UK");
    }

    setSelectedLab(lab);
  };

  return (
    <>
      <h2>Reporting laboratory (later as a dropdown)</h2>

      <LabSelect selectedLab={selectedLab} setSelectedLabHandler={setSelectedLabHandler} />

      <FieldSet as="textarea" name="address.streetAddress" label="Street Address" />
      <FieldSet name="address.city" label="City" />
      <FieldSet name="address.postCode" label="Post Code" />
      <FieldSet name="address.country" label="Country" />

      <h2>Patient information</h2>
      <FieldSet label="MRN" name="patient.mrn" />
      <FieldSet label="First Name" name="patient.lastName" />
      <FieldSet label="Last Name" name="patient.firstName" />
      <FieldSet label="Date of Birth" name="patient.dateOfBirth" type="date" />
      <FieldSet label="Gender" name="patient.gender" />
      <FieldSet label="Family Number" name="patient.familyNumber" />

      <FormStepBtn nextStep={nextStep} prevStep={prevStep} showNext={true} showPrev={false} showSubmit={false} />
    </>
  );
};

export default Patient;