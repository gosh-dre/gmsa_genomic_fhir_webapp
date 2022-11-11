import { FC } from "react";

import FieldSet from "../FieldSet";
import { sampleTypes } from "../../../code_systems/snomedCodes";
import { diseases } from "../../../code_systems/panelappCodes";

// Some dummy language data
const dummyData = [
  {
    label: "Chinese",
    value: "zh-CN",
  },
  {
    label: "English (US)",
    value: "en-US",
  },
  {
    label: "English (GB)",
    value: "en-GB",
  },
  {
    label: "French",
    value: "fr-FR",
  },
  {
    label: "Spanish",
    value: "es-ES",
  },
];

const Sample: FC = () => {
  return (
    <>
      <h2>Sample</h2>
      <FieldSet name="sample.specimenCode" label="Barcode" />
      <FieldSet name="sample.specimenType" label="Specimen type" selectOptions={sampleTypes} />
      <FieldSet name="sample.collectionDateTime" label="Sample collected datetime" />
      <FieldSet name="sample.receivedDateTime" label="Sample received datetime" />
      <FieldSet name="sample.authorisedDateTime" label="Sample authorised datetime" />
      <FieldSet name="sample.reasonForTestText" label="Reason for test" />
      <FieldSet name="sample.reasonForTest" label="Test reason" selectOptions={diseases} />

      <FieldSet name="sample.multiSelect" label="Test reason multi" isMulti={true} multiSelectOptions={dummyData} />
    </>
  );
};

export default Sample;
