import { FC } from "react";

import FieldSet from "../FieldSet";
import FormStepBtn from "../../UI/FormStepBtn";

interface Props {
  nextStep: () => void;
}

const Patient: FC<Props> = (props) => {
  const { nextStep } = props;

  return (
    <>
      <h2>Reporting laboratory (later as a dropdown)</h2>
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

      <FormStepBtn nextStep={nextStep} showNext={true} showPrev={false} />
    </>
  );
};

export default Patient;
