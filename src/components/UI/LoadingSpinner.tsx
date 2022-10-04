import { FC } from "react";

// import "./LoadingSpinner.css";

import classes from "./LoadingSpinner.module.css"

interface Props {
	asOverlay: boolean;
	message: string;
}

const LoadingSpinner: FC<Props> = (props) => {
	return (
		<div className={`${props.asOverlay && classes["loading-spinner__overlay"]}`}>
			<div className={classes["lds-dual-ring"]}></div>
			<div className={classes["loading-spinner__message"]}>{props.message}</div>
		</div>
	);
};

export default LoadingSpinner;
