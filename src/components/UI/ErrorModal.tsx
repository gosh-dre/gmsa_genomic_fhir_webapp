import { FC } from "react";

import Modal from "./Modal";

interface Props {
	onClear: () => void;
	error: string | null;
}

const ErrorModal: FC<Props> = (props) => {
	return (
		<Modal
			onCancel={props.onClear}
			header="Oops!"
			show={!!props.error}
			footer={<button onClick={props.onClear}>Okay</button>}
		>
			<p>{props.error}</p>
		</Modal>
	);
};

export default ErrorModal;
