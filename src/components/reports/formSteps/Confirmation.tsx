import { FC } from "react";

interface Props {
  prevStep: () => void;
}

const Confirmation: FC<Props> = (props) => {
  const { prevStep } = props;

  return (
    <>
      <div>form confirmation</div>
      <button onClick={prevStep}>prev</button>
    </>
  );
};

export default Confirmation;
