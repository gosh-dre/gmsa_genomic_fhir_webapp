import { FC } from "react";

import FieldSet from "../FieldSet";

const Sample: FC = () => {
  return (
    <>
      <h2>Sample</h2>
      <FieldSet name="sample.specimenCode" label="Barcode" />
      <FieldSet name="sample.specimenType" label="Specimen type" />
      <FieldSet type="datetime" name="sample.collectionDateTime" label="Sample collected date" />
      <FieldSet type="datetime" name="sample.receivedDateTime" label="Sample received date" />
      <FieldSet name="sample.reasonForTestText" label="Reason for test" />
      <FieldSet name="sample.reasonForTestCode" label="Test reason code" />
    </>
  );
};

export default Sample;
