import { FC } from "react";
import classes from "./FormStepBtn.module.css";

interface Props {
  showNext: boolean;
  showPrev: boolean;
  showSubmit: boolean;
  prevStep: () => void;
}

const FormStepBtn: FC<Props> = (props) => {
  const { showNext, showPrev, showSubmit, prevStep } = props;

  return (
    <div className={classes["form-step-btn-container"]}>
      {showPrev && (
        <div className={`${classes["form-step-btn"]} ${classes["prev"]}`} onClick={prevStep}>
          Prev
        </div>
      )}

      {showNext && (
        // <div className={`${classes["form-step-btn"]} ${classes["next"]}`} onClick={nextStep}>
        //   Next
        // </div>

        <button className={`${classes["form-step-btn"]} ${classes["submit"]}`} type="submit">
          Submit
        </button>
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
