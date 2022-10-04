import React, { FC, ReactElement } from "react";
import ReactDOM from "react-dom";

import Backdrop from "./Backdrop";
import classes from "./Modal.module.css";

interface ModalOverlayProps {
	className?: string;
	headerClass?: string;
	header: string;
	onSubmit?: () => void | undefined;
	contentClass?: string;
	footerClass?: string;
	footer?: ReactElement;
	children: ReactElement;
	isError: boolean;
}

interface ModalProps extends ModalOverlayProps {
	show: boolean;
	onCancel: () => void;
}

const ModalOverlay: FC<ModalOverlayProps> = (props:ModalOverlayProps) => {


	const errorClass = props.isError ? 'error' : 'info';

	const content = (
		<div className={`${classes.modal} ${classes[`${props.className}`]}`}>
			<header className={`${classes.modal__header} ${props.headerClass} ${classes[`${errorClass}`]}`}>
				<h2>{props.header}</h2>
			</header>
			<form
				onSubmit={
					props.onSubmit ? props.onSubmit : (event) => event.preventDefault()
				}
			>
				<div className={`${classes.modal__content} ${classes[`${props.contentClass}`]}`}>
					{props.children}
				</div>

				<footer className={`${classes.modal__footer} ${classes[`${props.footerClass}`]}`}>
					{props.footer}
				</footer>
			</form>
		</div>
	);
	return ReactDOM.createPortal(content, document.getElementById("modal-hook")!);
};

const Modal: FC<ModalProps> = (props) => {
	return (
		<>
			{props.show && 
				<>
					<Backdrop onClick={props.onCancel} /> 
					<ModalOverlay {...props} />
				</>
			}
		</>
	);
};

export default Modal;
