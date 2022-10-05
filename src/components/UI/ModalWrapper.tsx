import { FC } from "react";

import Modal from "./Modal";
import classes from "./Modal.module.css";

export interface ModalState {
  message: string | null | undefined;
  isError: boolean | null | undefined;
}

export interface Props {
  onClear: () => void;
  isError: boolean | null | undefined;
  modalMessage: string | null | undefined;
}

const ModalWrapper: FC<Props> = (props: Props) => {
  const { onClear, isError, modalMessage } = props;

  const errorClass = props.isError ? "error" : "info";

  return (
    <Modal
      onCancel={onClear}
      isError={isError}
      header={isError ? "Error" : "Info"}
      show={!!modalMessage}
      footer={
        <button className={`${classes.modal__btn} ${classes[`${errorClass}`]}`} onClick={onClear}>
          Okay
        </button>
      }
    >
      <p>{modalMessage}</p>
    </Modal>
  );
};

export default ModalWrapper;
