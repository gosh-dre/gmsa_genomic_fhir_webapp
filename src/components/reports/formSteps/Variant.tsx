import { FC } from "react";

import FieldSet from "../FieldSet";
import FormStepBtn from "../../UI/FormStepBtn";

interface Props {
  nextStep: () => void;
  prevStep: () => void;
}

const Variant: FC<Props> = (props) => {
  const { nextStep, prevStep } = props;

  return (
    <>
      <h2>Variant</h2>
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

      <FormStepBtn nextStep={nextStep} prevStep={prevStep} showNext={true} showPrev={true} showSubmit={false} />
    </>
  );
};

export default Variant;
