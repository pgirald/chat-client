import { useContext, useEffect, useRef, useState } from "react";
import { globalContext } from "../tests/src/Context";
import { MessageData } from "../components/Chat";
import { ChatUI, MessageUI } from "../Chore/Types";
import { userContext } from "../global/User";

export function useChats(
	initChats?: ChatUI[]
): [
	ChatUI[] | undefined,
	(idx: number, msgData: MessageData) => void,
	(chat: ChatUI[] | undefined) => void,
] {
	const [chats, setChats] = useState(initChats);

	const user = useContext(userContext);

	function addMessageTo(chatIdx: number, msgData: MessageData) {
		if (!chats?.[chatIdx]) {
			return;
		}

		const chat = chats[chatIdx];

		const message: MessageUI = {
			id: (chat.messages.at(-1)?.id || 0) + 1,
			attachments: msgData.attachments,
			content: msgData.content,
			receptionTime: new Date(Date.now()),
			sender: { ...user, blocked: false, muted: false },
			status: "Sent",
		};

		chat.messages.push(message);

		chats[chatIdx] = chat;

		setChats([...chats]);
	}

	return [chats, addMessageTo, setChats];
}
