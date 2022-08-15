import React, { ChangeEventHandler, FC, useEffect, useState } from "react";
import { FieldArray } from "formik";
import { v4 as uuidv4 } from "uuid";

import { FormValues } from "../ReportForm";
import FieldSet from "../FieldSet";
import classes from "./Variant.module.css";
import { codedValue, loincSelect } from "../../../code_systems/loincCodes";
import { geneCoding, queryHgnc } from "../../../code_systems/hgnc";
import { RequiredCoding } from "../../../code_systems/types";

interface Props {
  values: FormValues;
  setFieldValue: (field: string, value: string | string[]) => void;
  setReportFormGenes: React.Dispatch<React.SetStateAction<RequiredCoding[]>>;
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

const mergeByHgncId = (hgncGenes: RequiredCoding[], selectedGenes: RequiredCoding[]) => {
  const allGenes = [...hgncGenes];
  for (const selectedGene of selectedGenes) {
    const hgncCodes = hgncGenes.map((coding) => coding.code);
    if (!hgncCodes.includes(selectedGene.code)) {
      allGenes.push(selectedGene);
    }
  }
  return allGenes;
};

const Variant: FC<Props> = (props) => {
  const { values, setFieldValue, setReportFormGenes } = props;

  const [geneQuery, setGeneQuery] = useState("");
  const [hgncGenes, setHgncGenes] = useState<RequiredCoding[]>([]);
  const [selectedGenes, setSelectedGenes] = useState<RequiredCoding[]>([]);
  const allGenes = mergeByHgncId(hgncGenes, selectedGenes);
  setReportFormGenes(selectedGenes);

  const geneChangeHandler: ChangeEventHandler<HTMLInputElement> = (event) => {
    setGeneQuery(event.target.value);
  };

  useEffect(() => {
    // only update gene options while the component is mounted
    let mounted = true;

    const updateGenes = async () => {
      const { hgncs, symbols } = await queryHgnc(geneQuery);
      if (!mounted || !hgncs) {
        return;
      }
      const options = hgncs.map((hgnc, index) => geneCoding(hgnc, symbols[index].at(0)));
      setHgncGenes(options);
    };
    updateGenes().then();
    return () => {
      mounted = false;
    };
  }, [geneQuery, setHgncGenes]);

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
                  <label htmlFor="gene_search">Search for genes symbols:</label>
                  <input id="gene_search" name="gene_search" onChange={geneChangeHandler} value={geneQuery}></input>
                  <FieldSet
                    name={`variant[${index}].gene`}
                    label="Gene Symbol"
                    selectOptions={allGenes}
                    onChange={(e) => {
                      const currentValue = e.currentTarget.value;
                      setFieldValue(e.currentTarget.name, currentValue);
                      const currentSelection = codedValue(hgncGenes, currentValue);
                      const selectedHgncs = selectedGenes.map((coding) => coding.code);
                      if (!selectedHgncs.includes(currentValue)) {
                        setSelectedGenes([...selectedGenes, currentSelection]);
                      }
                    }}
                  />
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
