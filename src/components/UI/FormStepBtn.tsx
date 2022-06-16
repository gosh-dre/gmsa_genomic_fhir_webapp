import { FC } from "react";
import classes from "./FormStepBtn.module.css";

interface Props {
  showNext: boolean;
  showPrev: boolean;
  nextStep?: () => void;
  prevStep?: () => void;
}

const FormStepBtn: FC<Props> = (props) => {
  const { showNext, showPrev, nextStep, prevStep } = props;

  return (
    <div className={classes["form-step-btn-container"]}>
      {showPrev && (
        <div className={classes["form-step-btn"]} onClick={prevStep}>
          Prev
        </div>
      )}

      {showNext && (
        <div className={classes["form-step-btn"]} onClick={nextStep}>
          Next
        </div>
      )}
    </div>
  );
};

export default FormStepBtn;
