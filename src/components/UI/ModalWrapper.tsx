import { FC } from "react";

import Modal from "./Modal";
import classes from "./Modal.module.css";

interface Props {
	onClear: () => void;
	isError: boolean;
	modalMessage: string | null;
  }

const ModalWrapper: FC<Props> = (props: Props) => {
	const { onClear, isError, modalMessage } = props;

	return (
		<Modal
			onCancel={onClear}
			isError={isError}
			header={isError ? 'Error' : "Info"}
			show={!!modalMessage}
			footer={<button className={classes.modal__btn} onClick={onClear}>Okay</button>}
		>
			<p>{modalMessage}</p>
		</Modal>
	);
};

export default ModalWrapper;
