import { FC } from "react";

import FieldSet from "../FieldSet";
import FormStepBtn from "../../UI/FormStepBtn";
import classes from "./Variant.module.css";

interface Props {
  nextStep: () => void;
  prevStep: () => void;
  variantExists: boolean;
  setVariantExists: (bool: boolean) => void;
  setFieldValue: (field: string, value: string | string[] | boolean) => void;
}

const Variant: FC<Props> = (props) => {
  const { nextStep, prevStep, variantExists, setVariantExists, setFieldValue } = props;

  const setVariantHandler = () => {
    const currentVariantExists = !variantExists;

    if (!currentVariantExists) {
      setFieldValue("variant.gene", "none");
      setFieldValue("variant.genomicHGVS", "none");
      setFieldValue("variant.inheritanceMethod", "none");
      setFieldValue("variant.classification", "none");
      setFieldValue("variant.proteinHGVS", "none");
      setFieldValue("variant.transcript", "none");
      setFieldValue("variant.zygosity", "none");
      setFieldValue("variant.classificationEvidence", "none");
      setFieldValue("variant.confirmedVariant", false);
      setFieldValue("variant.comment", "none");
    }

    if (currentVariantExists) {
      setFieldValue("variant.gene", "");
      setFieldValue("variant.genomicHGVS", "");
      setFieldValue("variant.inheritanceMethod", "");
      setFieldValue("variant.classification", "");
      setFieldValue("variant.proteinHGVS", "");
      setFieldValue("variant.transcript", "");
      setFieldValue("variant.zygosity", "");
      setFieldValue("variant.classificationEvidence", "");
      setFieldValue("variant.confirmedVariant", false);
      setFieldValue("variant.comment", "");
    }

    setVariantExists(currentVariantExists);
  };

  return (
    <>
      <h2>Variant</h2>

      <div className={classes["variant-btn"]} onClick={() => setVariantHandler()}>
        {variantExists ? "Set no variant" : "Set variant"}
      </div>

      {variantExists && (
        <>
          <FieldSet name="variant.gene" label="Gene Symbol" />
          <FieldSet name="variant.transcript" label="Transcript" />
          <FieldSet name="variant.genomicHGVS" label="Genomic HGVS" />
          <FieldSet name="variant.proteinHGVS" label="Protein HGVS" />
          <FieldSet name="variant.zygosity" label="Zygosity" />
          <FieldSet name="variant.inheritanceMethod" label="Inhertiance Method" />
          <FieldSet name="variant.classification" label="Classification" />
          <FieldSet as="textarea" name="variant.classificationEvidence" label="Classification Evidence" />
          <FieldSet type="checkbox" name="variant.confirmedVariant" label="Variant Confirmed" />
          <FieldSet as="textarea" name="variant.comment" label="Comment" />
        </>
      )}

      {!variantExists && <div>No variant has been set. Click the button above to set a new variant</div>}

      <FormStepBtn nextStep={nextStep} prevStep={prevStep} showNext={true} showPrev={true} showSubmit={false} />
    </>
  );
};

export default Variant;
