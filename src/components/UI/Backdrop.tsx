import { FC } from "react";
import ReactDOM from "react-dom";

import classes from "./Backdrop.module.css";

interface Props {
	onClick: () => void;
}

const Backdrop: FC<Props> = (props:Props) => {
	return ReactDOM.createPortal(
		<div className={classes.backdrop} onClick={props.onClick}></div>,
		document.getElementById("backdrop-hook")!
	);
};

export default Backdrop;
