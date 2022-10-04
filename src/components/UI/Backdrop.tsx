import { FC } from "react";
import ReactDOM from "react-dom";

import classes from "./Backdrop.module.css";

interface Props {
	onClick: () => void;
}

const Backdrop: FC<Props> = (props:Props) => {
	const backdropElement: HTMLElement | null = document.getElementById("backdrop-hook");

	return backdropElement ? ReactDOM.createPortal(
		<div className={classes.backdrop} onClick={props.onClick}></div>,
		backdropElement
    ) : null;
};

export default Backdrop;
