import { ChangeEventHandler, FC, useEffect, useState } from "react";
import { FieldArray } from "formik";
import { v4 as uuidv4 } from "uuid";

import { FormValues } from "../ReportForm";
import FieldSet from "../FieldSet";
import classes from "./Variant.module.css";
import { codedValue, loincSelect } from "../../../code_systems/loincCodes";
import { Coding } from "@smile-cdr/fhirts/dist/FHIR-R4/classes/models-r4";

interface Props {
  values: FormValues;
  setFieldValue: (field: string, value: string | string[]) => void;
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

const mergeByHgncId = (hgncGenes: Coding[], selectedGenes: Coding[]) => {
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
  const { values, setFieldValue } = props;

  const [geneQuery, setGeneQuery] = useState("");
  const [hgncGenes, setHgncGenes] = useState<Coding[]>([]);
  const [selectedGenes, setSelectedGenes] = useState<Coding[]>([]);
  const allGenes = mergeByHgncId(hgncGenes, selectedGenes);

  const geneChangeHandler: ChangeEventHandler<HTMLInputElement> = (event) => {
    setGeneQuery(event.target.value);
  };

  useEffect(() => {
    // only update gene options while the component is mounted
    let mounted = true;

    const updateGenes = async () => {
      if (geneQuery.trim() === "") {
        return;
      }
      const response = await fetch(
        `https://clinicaltables.nlm.nih.gov/api/genes/v4/search?terms=${geneQuery}&df=symbol&q=symbol:${geneQuery}*`,
      );
      const body = await response.json();
      if (mounted) {
        const hgncs = body.at(1) as string[];
        const symbols = body.at(3).at(0) as string[];
        if (!hgncs) {
          return;
        }
        const options = hgncs.map((hgnc, index) => {
          return { code: hgnc, display: symbols[index], system: "http://www.genenames.org/geneId" };
        });
        setHgncGenes(options);
      }
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
