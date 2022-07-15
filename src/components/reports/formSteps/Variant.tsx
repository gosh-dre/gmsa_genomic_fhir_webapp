import { FC } from "react";

import FieldSet from "../FieldSet";
import classes from "./Variant.module.css";

interface Props {
  variantExists: boolean;
  setVariantExists: (bool: boolean) => void;
  setFieldValue: (field: string, value: string | string[] | boolean) => void;
}

const Variant: FC<Props> = (props) => {
  const { variantExists, setVariantExists } = props;

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
          <FieldSet name="variant[0].zygosity" label="Zygosity" />
          <FieldSet name="variant[0].inheritanceMethod" label="Inhertiance Method" />
          <FieldSet name="variant[0].classification" label="Classification" />
          <FieldSet as="textarea" name="variant[0].classificationEvidence" label="Classification Evidence" />
          <FieldSet type="checkbox" name="variant[0].confirmedVariant" label="Variant Confirmed" />
          <FieldSet as="textarea" name="variant[0].comment" label="Comment" />
        </>
      )}

      {!variantExists && <div>No variant has been set. Click the button above to set a new variant</div>}
    </>
  );
};

export default Variant;
