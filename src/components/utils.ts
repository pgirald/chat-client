import { User } from "chat-api";
import { ChatUI } from "../Chore/Types";
import { Language } from "../Global/Language";

export function chatLabel(chat: ChatUI, user: User, language: Language) {
	let chatName: string;
	if (chat.name) {
		chatName = chat.name;
	} else if (chat.subs.length === 1) {
		chatName =
			chat.subs[0].id === user.id
				? `${user.username} (${language.me})`
				: chat.subs[0].username;
	}
	if (chat.subs.length === 2) {
		const contact = chat.subs.find((sub) => sub.id !== user.id)!;
		chatName = contact.username;
	} else {
		chatName = `${language.group} ${chat.id}`;
	}
	return chatName;
}


export function subsConnected(chat: ChatUI, user: User) {
	return chat.subs
		.filter((sub) => sub.id !== user.id)
		.every((sub) => sub.connected);
}
