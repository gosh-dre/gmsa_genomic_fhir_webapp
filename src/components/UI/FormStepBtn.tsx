import { FC } from "react";
import classes from "./FormStepBtn.module.css";

interface Props {
  showNext: boolean;
  showPrev: boolean;
  showSubmit: boolean;
  nextStep: () => void;
  prevStep: () => void;
}

const FormStepBtn: FC<Props> = (props) => {
  const { showNext, showPrev, showSubmit, nextStep, prevStep } = props;

  return (
    <div className={classes["form-step-btn-container"]}>
      {showPrev && (
        <div className={`${classes["form-step-btn"]} ${classes["prev"]}`} onClick={prevStep}>
          Prev
        </div>
      )}

      {showNext && (
        <div className={`${classes["form-step-btn"]} ${classes["next"]}`} onClick={nextStep}>
          Next
        </div>
      )}

      {showSubmit && (
        <button className={`${classes["form-step-btn"]} ${classes["submit"]}`} type="submit">
          Submit
        </button>
      )}
    </div>
  );
};

export default FormStepBtn;
