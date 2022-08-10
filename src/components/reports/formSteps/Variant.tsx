import { FC, useEffect, useState } from "react";
import { FieldArray } from "formik";
import { v4 as uuidv4 } from "uuid";

import { FormValues } from "../ReportForm";
import FieldSet from "../FieldSet";
import classes from "./Variant.module.css";
import { loincSelect } from "../../../code_systems/loincCodes";
import fetch from "node-fetch";
import { Coding } from "@smile-cdr/fhirts/dist/FHIR-R4/classes/models-r4";

interface Props {
  values: FormValues;
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

  const [genes, setGenes] = useState<Coding[]>([]);

  useEffect(() => {
    // only update gene options while the component is mounted
    let mounted = true;

    const updateGenes = async () => {
      const response = await fetch(
        "https://clinicaltables.nlm.nih.gov/api/genes/v4/search?terms=GNA&df=symbol&q=symbol:GNAO*",
      );
      const body = await response.json();
      if (mounted) {
        const hgncs = body.at(1) as string[];
        const symbols = body.at(3) as string[];
        const options = hgncs.map((hgnc, index) => {
          return { code: hgnc, display: symbols[index], system: "http://www.genenames.org/geneId" };
        });
        setGenes(options);
      }
    };
    updateGenes().then();
    return () => {
      mounted = false;
    };
  }, []);

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
                  <FieldSet name={`variant[${index}].gene`} label="Gene Symbol" selectOptions={genes} />
                  <FieldSet as="textarea" name={`variant[${index}].geneInformation`} label="Gene Information" />
                  <FieldSet name={`variant[${index}].transcript`} label="Transcript" />
                  <FieldSet name={`variant[${index}].genomicHGVS`} label="Genomic HGVS" />
                  <FieldSet name={`variant[${index}].proteinHGVS`} label="Protein HGVS" />
                  <FieldSet name={`variant[${index}].zygosity`} label="Zygosity" selectOptions={loincSelect.zygosity} />
                  <FieldSet
                    name={`variant[${index}].inheritanceMethod`}
                    label="Inhertiance Method"
                    selectOptions={loincSelect.inheritance}
                  />
                  <FieldSet
                    name={`variant[${index}].classification`}
                    label="Classification"
                    selectOptions={loincSelect.classification}
                  />
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
