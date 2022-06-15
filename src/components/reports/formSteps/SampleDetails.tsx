import { FC } from "react";

import FieldSet from "../FieldSet";

const SampleDetails: FC = () => {
  return (
    <>
      <h2>Sample</h2>
      <FieldSet name="sample.specimenCode" label="Barcode" />
      <FieldSet name="sample.specimenType" label="Specimen Type" />
      <FieldSet type="date" name="sample.collectionDate" label="Sample collection date" />
      <FieldSet name="sample.reasonForTestText" label="Reason for test" />
      <FieldSet name="sample.reasonForTestCode" label="Test reason code" />
    </>
  );
};

export default SampleDetails;
