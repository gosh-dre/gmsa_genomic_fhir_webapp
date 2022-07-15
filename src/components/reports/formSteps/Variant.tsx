import { FC } from "react";
import { FieldArray } from "formik";
import { v4 as uuidv4 } from "uuid";
import * as Yup from "yup";

import FieldSet from "../FieldSet";
import classes from "./Variant.module.css";

interface Props {
  values: any;
}

const emptyVariant = {
  gene: "",
  geneInformation: "",
  genomicHGVS: "",
  inheritanceMethod: "",
  classification: "",
  proteinHGVS: "",
  transcript: "",
  zygosity: "",
  classificationEvidence: "",
  confirmedVariant: false,
  comment: "",
};

const Variant: FC<Props> = (props) => {
  const { values } = props;

  console.log(values);

  return (
    <>
      <h2>Variant</h2>

      <FieldArray
        name="variant"
        render={(arrayHelpers) => (
          <div>
            {values.variant &&
              values.variant.length > 0 &&
              values.variant.map((variant: any, index: number) => (
                <div key={index}>
                  <FieldSet name={`variant[${index}].gene`} label="Gene Symbol" />
                  <FieldSet as="textarea" name={`variant[${index}].geneInformation`} label="Gene Information" />
                  <FieldSet name={`variant[${index}].transcript`} label="Transcript" />
                  <FieldSet name={`variant[${index}].genomicHGVS`} label="Genomic HGVS" />
                  <FieldSet name={`variant[${index}].proteinHGVS`} label="Protein HGVS" />
                  <FieldSet name={`variant[${index}].zygosity`} label="Zygosity" />
                  <FieldSet name={`variant[${index}].inheritanceMethod`} label="Inhertiance Method" />
                  <FieldSet name={`variant[${index}].classification`} label="Classification" />
                  <FieldSet
                    as="textarea"
                    name={`variant[${index}].classificationEvidence`}
                    label="Classification Evidence"
                  />
                  <FieldSet type="checkbox" name={`variant[${index}].confirmedVariant`} label="Variant Confirmed" />
                  <FieldSet as="textarea" name={`variant[${index}].comment`} label="Comment" />

                  <button
                    className={classes["variant-btn"]}
                    type="button"
                    onClick={() => arrayHelpers.remove(index)} // remove a variant from the list
                  >
                    Delete variant
                  </button>

                  <hr></hr>
                </div>
              ))}

            <button
              className={`${classes["variant-btn"]} ${classes["variant-btn-center"]}`}
              type="button"
              onClick={() => arrayHelpers.push({ ...emptyVariant, id: uuidv4() })}
            >
              Add a variant
            </button>
          </div>
        )}
      />
    </>
  );
};

export default Variant;
