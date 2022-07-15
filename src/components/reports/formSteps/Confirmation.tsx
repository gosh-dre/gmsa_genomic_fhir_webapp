import React, { FC } from "react";
import { v4 as uuidv4 } from "uuid";

import classes from "../ReportForm.module.css";
import FormStepBtn from "../../UI/FormStepBtn";

interface Props {
  nextStep: () => void;
  prevStep: () => void;
  formRef: any;
}

const Confirmation: FC<Props> = (props) => {
  const { nextStep, prevStep, formRef } = props;

  const formObj = formRef.current.values;
  const formObjAsArray: { [key: string]: string }[] = Object.keys(formObj).map((key: any) => {
    return formObj[key];
  });
  const formKeysArray: string[][] = formObjAsArray.map((key: any) => {
    return Object.keys(key);
  });

  return (
    <>
      <h2>Please check your form entries</h2>

      {formKeysArray.map((objKey: string[], index: number) => {
        return objKey.map((formKey: string) => {
          return (
            <div key={uuidv4()} className={`${classes["confirmation-element-container"]}`}>
              <span className={`${classes["confirmation-key"]}`}>{formKey}:</span>

              <span className={`${classes["confirmation-value"]}`}>{formObjAsArray[index][formKey].toString()}</span>
            </div>
          );
        });
      })}

      <FormStepBtn nextStep={nextStep} prevStep={prevStep} showNext={false} showPrev={true} showSubmit={true} />
    </>
  );
};

export default Confirmation;
