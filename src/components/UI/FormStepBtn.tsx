import { FC } from "react";
import classes from "./FormStepBtn.module.css";

interface Props {
  formStep: number;
  prevStep: () => void;
  isLastStep: boolean;
  isSubmitting: boolean | undefined;
}

const FormStepBtn: FC<Props> = (props) => {
  const { prevStep, formStep, isSubmitting, isLastStep } = props;

  return (
    <div className={classes["form-step-btn-container"]}>
      {formStep !== 0 && (
        <div className={`${classes["form-step-btn"]} ${classes["prev"]}`} onClick={prevStep}>
          Prev
        </div>
      )}

      <button className={`${classes["form-step-btn"]} ${classes["submit"]}`} type="submit" disabled={isSubmitting}>
        {isLastStep ? "Submit" : "Next"}
      </button>
    </div>
  );
};

export default FormStepBtn;
