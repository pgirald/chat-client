import { useContext, useEffect, useReducer, useRef, useState } from "react";
import socket from "../socket";
import { ChatMessageData, ChatSection } from "./ChatSection";
import { Indexed, Optional } from "../utils/Types";
import { AttachmentData, ContactStatusData } from "chat-api";
import { Client, Source } from "../Chore/Source";
import { range } from "../utils";
import { useLoading } from "./LoadingModal";
import { ChatUI, MessageUI, UserUI } from "../Chore/Types";
import { MessageData } from "./Chat";
import { userContext } from "../global/User";
import { sourceContext } from "../global/Source";

type _User = {
	userID: string;
	username: string;
};

export type ChatPageProps = {
	onConnectionError?: (e: Error) => void;
};

type ChatsActions = "Add" | "Update";

type ActionData<T> = T extends "Add"
	? Indexed<ChatUI>
	: T extends "Update"
		? Indexed<Optional<ChatUI>>
		: unknown;

// function chatsReducer(
// 	state: readonly ChatUI[],
// 	{
// 		action,
// 		data,
// 		place,
// 	}: {
// 		action: ChatsActions;
// 		data: ActionData<typeof action>;
// 		place?: string;
// 	}
// ): ChatUI[] {
// 	let next: ChatUI[];
// 	switch (action) {
// 		case "Add":
// 			next = [...state, ...(data as ChatUI[])];
// 			break;
// 		case "Update":
// 			const dataKeys = Object.keys(data);
// 			if (dataKeys.length !== 1) {
// 				throw Error(`Data must have a lenght of 1 when action is "${action}"`);
// 			}
// 			next = [...state];
// 			const key = Number(dataKeys[0]);
// 			next[key] = { ...next[key], ...data[key] };
// 			break;
// 		default:
// 			throw Error(`${action} action is not valid`);
// 	}
// 	console.group(place || "*********Not specified*********");
// 	console.log(`Action: ${action}`);
// 	console.log("Old state: \n");
// 	console.log(state);
// 	console.log("Next state: \n");
// 	console.log(next);
// 	console.groupEnd();
// 	return next;
// }

export function ChatPage(props: ChatPageProps) {
	const [setLoading] = useLoading();
	const [isConnected, setIsConnected] = useState<boolean>(false);
	const [chats, setChats] = useState<ChatUI[]>([]);
	const chatsRef = useRef(chats);
	const user = useContext(userContext);
	const source = useContext(sourceContext);

	useEffect(() => {
		chatsRef.current = chats;
	}, [chats]);

	useEffect(() => {
		(async () => {
			await fetchChats();
		})();
	}, []);

	useEffect(() => {
		onMount();
		return onUnmount();
	});

	return (
		<ChatSection
			userConnected={isConnected}
			onMessage={onMessage}
			className="h-full w-full"
		>
			{chats}
		</ChatSection>
	);

	async function onMessage(e: ChatMessageData) {
		let message: MessageUI = {
			content: e.msg.content,
			attachments: e.msg.attachments,
			receptionTime: new Date(),
			status: "Sending",
			sender: user,
			id: Date.now(),
		};

		const msgIdx = chats[e.idx].messages.push(message) - 1;

		setChats([...chats]);

		message = await source.sendMessage(
			e.msg.content,
			e.msg.attachments,
			e.selectedChat
		);

		chats[e.idx].messages[msgIdx] = message;

		setChats([...chats]);
	}

	async function fetchChats() {
		setLoading(true);
		setChats(await source.getAllMyChats());
		setLoading(false);
	}

	function onMount() {
		{
			source.emitter.onConnectionStatusChanged.add(updateConnectionStatus);

			source.emitter.onContactStatusChaged.add(updateContactStatus);

			source.emitter.onMessageReceived.add(updateChat);

			props.onConnectionError &&
				source.emitter.onError.add(props.onConnectionError);
		}

		source.emitter.connect();
	}

	function onUnmount() {
		source.emitter.onConnectionStatusChanged.remove(updateConnectionStatus);

		source.emitter.onContactStatusChaged.remove(updateContactStatus);

		source.emitter.onMessageReceived.remove(updateChat);

		props.onConnectionError &&
			source.emitter.onError.remove(props.onConnectionError);

		source.emitter.disconnect();
	}

	function updateConnectionStatus(online: boolean) {
		setIsConnected(online);
	}

	function updateContactStatus(statusData: ContactStatusData) {
		const idxs = range(0, chatsRef.current.length - 1).reduce<number[][]>(
			(idxs, idx, _) => {
				const subIdx = chatsRef.current[idx].subs.findIndex(
					(sub) => sub.id === statusData.id
				);
				if (subIdx !== -1) {
					idxs.push([idx, subIdx]);
				}
				return idxs;
			},
			[]
		);
		for (const _idxs of idxs) {
			const [chatIdx, subIdx] = _idxs;
			const subs = chatsRef.current[chatIdx].subs;
			subs[subIdx].connected = statusData.connected;
			chatsRef.current[chatIdx].subs = subs;

			setChats([...chatsRef.current]);
		}
	}

	function updateChat(message: MessageUI, chatId: number) {
		const idx = chatsRef.current.findIndex((chat) => chat.id === chatId);

		const messages = chatsRef.current[idx].messages.push(message);

		setChats([...chatsRef.current]);
	}
}
