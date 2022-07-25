import { FC } from "react";
import { v4 as uuidv4 } from "uuid";

import classes from "./Confirmation.module.css";

interface Props {
  formRef: any;
}

const Confirmation: FC<Props> = (props) => {
  const { formRef } = props;

  let formObj = formRef.current.values;

  // parse the variants and add them to the formObj as separate keys
  if (formObj.variant && formObj.variant.length > 0) {
    formObj.variant.map((variant: { [key: string]: string }, index: number) => {
      formObj = { ...formObj, [`variant${index}`]: variant };
    });
    delete formObj.variant; // delete the old redundant variant key
  }

  const formObjAsArray: { [key: string]: string }[] = Object.keys(formObj).map((key: string) => {
    if (key === "variant" && formObj[key].length === 0) {
      return { variants: "no variants reported" };
    }
    return formObj[key];
  });

  const formKeysArray: string[][] = formObjAsArray.map((key: { [key: string]: string }) => {
    return Object.keys(key);
  });

  return (
    <>
      <h2>Please check your form entries</h2>

      {formKeysArray.map((objKey: string[], index: number) => {
        return objKey.map((formKey: string) => {
          return (
            <div key={uuidv4()} className={`${classes["confirmation-element-container"]}`}>
              {formKey === "gene" && (
                <h3 className={`${classes["confirmation-key"]} ${classes["variant-key"]}`}>
                  New variant: {formObjAsArray[index]["id"]}
                </h3>
              )}

              <span className={`${classes["confirmation-key"]}`}>{formKey}:</span>

              <span className={`${classes["confirmation-value"]}`}>{formObjAsArray[index][formKey].toString()}</span>
            </div>
          );
        });
      })}
    </>
  );
};

export default Confirmation;
