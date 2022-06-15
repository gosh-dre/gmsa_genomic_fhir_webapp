import { FC } from "react";

import FieldSet from "../FieldSet";

const VariantDetails: FC = () => {
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
    </>
  );
};

export default VariantDetails;
