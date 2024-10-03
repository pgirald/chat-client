import { User } from "chat-api";
import { ChatUI } from "../Chore/Types";
import { Language } from "../global/Language";
import {
	CSSProperties,
	ForwardedRef,
	forwardRef,
	ReactNode,
	useContext,
	useState,
} from "react";
import { IoMdCloseCircle } from "react-icons/io";
import { fixedTheme, themeContext } from "../global/Theme";
import Modal from "react-modal";
import { E, empty } from "../utils";
import { env } from "process";
import profileImage from "../assets/chat_default.png";
import { BsX } from "react-icons/bs";
import { BsXLg } from "react-icons/bs";

export function chatLabel(chat: ChatUI, user: User, language: Language) {
	let chatName: string;
	if (chat.name) {
		chatName = chat.name;
	} else if (chat.subs.length === 1) {
		chatName =
			chat.subs[0].id === user.id
				? `${user.username} (${language.me})`
				: chat.subs[0].username;
	} else if (chat.subs.length === 2) {
		const contact = chat.subs.find((sub) => sub.id !== user.id)!;
		chatName = contact.username;
	} else {
		chatName =
			chat.id === -1 ? language.newChat : `${language.group} ${chat.id}`;
	}
	return chatName;
}

export function subsConnected(chat: ChatUI, user: User) {
	return chat.subs
		.filter((sub) => sub.id !== user.id)
		.every((sub) => sub.connected);
}

export function chatImg(chat: ChatUI, user: User): string {
	if (chat.img) {
		return chat.img;
	}
	const others = chat.subs.filter((sub) => sub.id !== user.id);
	if (others.length === 1 && others[0].img) {
		return others[0].img;
	}
	if (others.length === 0 && user.img) {
		return user.img;
	}
	return profileImage;
}

export type CloseFrameProps = {
	children: ReactNode;
	onCloseRequested?: () => void;
	margin?: number;
	iconSize?: number;
	className?: string;
	wrapperClassName?: string;
	wrapperStyle?: CSSProperties;
	style?: CSSProperties;
};

export const CloseFrame = forwardRef(
	(props: CloseFrameProps, ref?: ForwardedRef<HTMLDivElement>) => {
		return (
			<div
				className={`-:items-end -:h-fit -:w-fit ${E(props.className)}`}
				style={props.style}
				ref={ref}
			>
				<BsXLg
					className="icon"
					color="white"
					style={{ backgroundColor: fixedTheme.red, margin: 4 }}
					strokeWidth={1}
					onClick={props.onCloseRequested}
					size={props.iconSize || 25}
				/>
				<div
					className={props.wrapperClassName}
					style={{ ...props.wrapperStyle }}
				>
					{props.children}
				</div>
			</div>
		);
	}
);

// export type ClosableModalProps = {
// 	frameProps?: Omit<CloseFrameProps, "children" | "isOpen">;
// 	modalProps: Omit<Modal.Props, "children">;
// 	children?: ReactNode;
// };

// export type ModalHandler = { openModal: () => void; closeModal: () => void };

// export const ClosableModal = (props: ClosableModalProps) => {
// 	return (
// 		<Modal {...{ ...props.modalProps, children: undefined, isOpen: isOpen }}>
// 			<CloseFrame {...{ ...props.frameProps, children: undefined }}>
// 				{props.children}
// 			</CloseFrame>
// 		</Modal>
// 	);
// };
