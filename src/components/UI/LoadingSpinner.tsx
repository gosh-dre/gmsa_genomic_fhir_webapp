import { FC } from "react";

import "./LoadingSpinner.css";

interface Props {
	asOverlay: boolean;
	message: string;
}

const LoadingSpinner: FC<Props> = (props) => {
	return (
		<div className={`${props.asOverlay && "loading-spinner__overlay"}`}>
			<div className="lds-dual-ring"></div>
			<div className="loading-spinner__message">{props.message}</div>
		</div>
	);
};

export default LoadingSpinner;
