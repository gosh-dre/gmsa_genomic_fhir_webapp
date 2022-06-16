import { FC } from "react";

import FormStepBtn from "../../UI/FormStepBtn";

interface Props {
  prevStep: () => void;
}

const Confirmation: FC<Props> = (props) => {
  const { prevStep } = props;

  return (
    <>
      <div>form confirmation</div>
      <FormStepBtn prevStep={prevStep} showNext={false} showPrev={true} />
    </>
  );
};

export default Confirmation;
