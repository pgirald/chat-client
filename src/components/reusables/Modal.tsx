import {
	CSSProperties,
	ForwardedRef,
	forwardRef,
	ReactNode,
	useContext,
	useEffect,
	useImperativeHandle,
	useState,
} from "react";
import ReactModal from "react-modal";
import { themeContext } from "../../global/Theme";
import { E } from "../../utils/StringOps";
import { CloseFrame, CloseFrameProps } from "./CloseFrame";

export type ModalProps = {
	reactModalProps?: Omit<ReactModal["props"], "children" | "isOpen">;
	closeFrameProps?: Omit<CloseFrameProps, "children" | "onCloseRequested">;
	children: ReactNode;
	onCloseModal?: () => void;
};

export type ModalHandler = {
	openModal: () => void;
	closeModal: () => void;
};

export const Modal = forwardRef(
	(props: ModalProps, ref: ForwardedRef<ModalHandler>) => {
		const [show, setShow] = useState(false);
		const theme = useContext(themeContext);

		useEffect(() => {
			ReactModal.setAppElement("body");
		}, []);

		useImperativeHandle(ref, () => ({ openModal, closeModal }));

		const modalStyle: ReactModal.Styles = {
			overlay: {
				alignItems: "center",
				justifyContent: "center",
				...props.reactModalProps?.style?.overlay,
			},
			content: {
				backgroundColor: theme.bg,
				margin: 0,
				padding: 0,
				maxHeight: "100%",
				...props.reactModalProps?.style?.content,
			},
		};

		const modalClass = `${E(props.reactModalProps?.className)} -:h-fit -:w-fit -:items-center -:rounded-md -:border`;

		return (
			<ReactModal
				isOpen={show}
				{...{
					...props.reactModalProps,
					style: modalStyle,
					className: modalClass,
				}}
			>
				<CloseFrame onCloseRequested={closeModal} {...props.closeFrameProps}>
					{props.children}
				</CloseFrame>
			</ReactModal>
		);

		function openModal() {
			setShow(true);
		}

		function closeModal() {
			setShow(false);
			props.onCloseModal?.();
		}
	}
);
