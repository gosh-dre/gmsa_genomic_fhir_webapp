import { FC } from "react";
import { Field, Form, Formik, FormikProps } from "formik";
import CustomSelect from "../CustomSelectField";

import FieldSet from "../FieldSet";
import { sampleTypes } from "../../../code_systems/snomedCodes";
import { diseases } from "../../../code_systems/panelappCodes";

export interface FormValues {
  singleLanguage: string;
  multiLanguages: string[];
}

const defaultValues: FormValues = {
  singleLanguage: "",
  multiLanguages: [],
};

// Some dummy language data
const languageOptions = [
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
      <Field
        className="custom-select"
        name="multiLanguages"
        options={languageOptions}
        component={CustomSelect}
        placeholder="Select multi languages..."
        isMulti={true}
      />
    </>
  );
};

export default Sample;
