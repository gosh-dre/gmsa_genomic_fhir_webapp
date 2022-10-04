import { FC } from "react";

import Modal from "./Modal";
import classes from "./Modal.module.css";

interface Props {
	onClear: () => void;
	error: string | null;
	header: string
  }

const ErrorModal: FC<Props> = (props: Props) => {
	const { onClear, error, header } = props;

	return (
		<Modal
			onCancel={onClear}
			header={header}
			show={!!error}
			footer={<button className={classes.modalBtn} onClick={onClear}>Okay</button>}
		>
			<p>{error}</p>
		</Modal>
	);
};

export default ErrorModal;
