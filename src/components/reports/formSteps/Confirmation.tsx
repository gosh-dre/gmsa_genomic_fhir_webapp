import { FC } from "react";

import FormStepBtn from "../../UI/FormStepBtn";

interface Props {
  nextStep: () => void;
  prevStep: () => void;
}

const Confirmation: FC<Props> = (props) => {
  const { nextStep, prevStep } = props;

  return (
    <>
      <div>form confirmation</div>
      <FormStepBtn nextStep={nextStep} prevStep={prevStep} showNext={false} showPrev={true} showSubmit={true} />
    </>
  );
};

export default Confirmation;
