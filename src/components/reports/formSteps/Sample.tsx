import { FC } from "react";

import FieldSet from "../FieldSet";

interface Props {
  nextStep: () => void;
  prevStep: () => void;
}

const Sample: FC<Props> = (props) => {
  const { nextStep, prevStep } = props;

  return (
    <>
      <h2>Sample</h2>
      <FieldSet name="sample.specimenCode" label="Barcode" />
      <FieldSet name="sample.specimenType" label="Specimen Type" />
      <FieldSet type="date" name="sample.collectionDate" label="Sample collection date" />
      <FieldSet name="sample.reasonForTestText" label="Reason for test" />
      <FieldSet name="sample.reasonForTestCode" label="Test reason code" />

      <button onClick={prevStep}>Prev</button>
      <button onClick={nextStep}>Next</button>
    </>
  );
};

export default Sample;
