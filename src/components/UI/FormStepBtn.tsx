import { FC } from "react";
import classes from "./FormStepBtn.module.css";

interface Props {
  prevStep: () => void;
  formStep: number;
}

const FormStepBtn: FC<Props> = (props) => {
  const { prevStep, formStep } = props;

  return (
    <div className={classes["form-step-btn-container"]}>
      {formStep !== 1 && (
        <div className={`${classes["form-step-btn"]} ${classes["prev"]}`} onClick={prevStep}>
          Prev
        </div>
      )}

      <button className={`${classes["form-step-btn"]} ${classes["submit"]}`} type="submit">
        {formStep === 5 ? "Submit" : "Next"}
      </button>
    </div>
  );
};

export default FormStepBtn;
