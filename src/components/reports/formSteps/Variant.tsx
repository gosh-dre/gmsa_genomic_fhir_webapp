import { FC } from "react";

import FieldSet from "../FieldSet";
import FormStepBtn from "../../UI/FormStepBtn";
import classes from "./Variant.module.css";
import { loincSelect } from "../../../code_systems/loincCodes";

interface Props {
  nextStep: () => void;
  prevStep: () => void;
  variantExists: boolean;
  setVariantExists: (bool: boolean) => void;
  setFieldValue: (field: string, value: string | string[] | boolean) => void;
}

const Variant: FC<Props> = (props) => {
  const { nextStep, prevStep, variantExists, setVariantExists } = props;

  const setVariantHandler = () => {
    setVariantExists(!variantExists);
  };

  return (
    <>
      <h2>Variant</h2>

      <div className={classes["variant-btn"]} onClick={() => setVariantHandler()}>
        {variantExists ? "Set no variant" : "Set variant"}
      </div>

      {variantExists && (
        <>
          <FieldSet name="variant[0].gene" label="Gene Symbol" />
          <FieldSet as="textarea" name="variant[0].geneInformation" label="Gene Information" />
          <FieldSet name="variant[0].transcript" label="Transcript" />
          <FieldSet name="variant[0].genomicHGVS" label="Genomic HGVS" />
          <FieldSet name="variant[0].proteinHGVS" label="Protein HGVS" />
          <FieldSet name="variant[0].zygosity" label="Zygosity" selectOptions={loincSelect.zygosity}/>
          <FieldSet name="variant[0].inheritanceMethod" label="Inhertiance Method"             selectOptions={loincSelect.inheritance}
          />
          <FieldSet name="variant[0].classification" label="Classification" />
          <FieldSet as="textarea" name="variant[0].classificationEvidence" label="Classification Evidence" selectOptions={loincSelect.classification}/>
          <FieldSet type="checkbox" name="variant[0].confirmedVariant" label="Variant Confirmed" />
          <FieldSet as="textarea" name="variant[0].comment" label="Comment" />
        </>
      )}

      {!variantExists && <div>No variant has been set. Click the button above to set a new variant</div>}

      <FormStepBtn nextStep={nextStep} prevStep={prevStep} showNext={true} showPrev={true} showSubmit={false} />
    </>
  );
};

export default Variant;
