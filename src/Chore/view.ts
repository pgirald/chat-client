import { User } from "chat-api";
import { ChatUI } from "./Types";
import { Language } from "../global/Language";
import {
	CSSProperties,
	ForwardedRef,
	forwardRef,
	ReactNode,
	useContext,
	useState,
} from "react";
import { fixedTheme, themeContext } from "../global/Theme";
import profileImage from "../assets/chat_default.png";
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