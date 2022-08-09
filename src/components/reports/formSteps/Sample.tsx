import { FC } from "react";

import FieldSet from "../FieldSet";
import { diseases, sampleTypes } from "../../../code_systems/snomedCodes";

const Sample: FC = () => {
  return (
    <>
      <h2>Sample</h2>
      <FieldSet name="sample.specimenCode" label="Barcode" />
      <FieldSet name="sample.specimenType" label="Specimen type" selectOptions={sampleTypes} />
      <FieldSet name="sample.collectionDateTime" label="Sample collected datetime" />
      <FieldSet name="sample.receivedDateTime" label="Sample received datetime" />
      <FieldSet name="sample.reasonForTestText" label="Reason for test" />
      <FieldSet name="sample.reasonForTest" label="Test reason" selectOptions={diseases} />
    </>
  );
};

export default Sample;
