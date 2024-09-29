export {};
import { useEffect, useReducer, useRef, useState } from "react";
import socket from "../socket";
import { ChatMessageData, ChatSection } from "./ChatSection";
import { Indexed, Optional } from "../utils/Types";
import { AttachmentData, ContactStatusData } from "chat-api";
import { Client, Source } from "../Chore/Source";
import { range } from "../utils";
import "../utils/Extensions";
import { useLoading } from "./LoadingModal";
import { ChatUI, MessageUI, UserUI } from "../Chore/Types";
import { MessageData } from "./Chat";

type _User = {
	userID: string;
	username: string;
};

export type ChatPageProps = {
	user: UserUI;
	source: Source;
	onConnectionError?: (e: Error) => void;
};

type ChatsActions = "Add" | "Update";

type ActionData<T> = T extends "Add"
	? Indexed<ChatUI>
	: T extends "Update"
		? Indexed<Optional<ChatUI>>
		: unknown;

function chatsReducer(
	state: readonly ChatUI[],
	{
		action,
		data,
		place,
	}: {
		action: ChatsActions;
		data: ActionData<typeof action>;
		place?: string;
	}
): ChatUI[] {
	let next: ChatUI[];
	switch (action) {
		case "Add":
			next = [...state, ...(data as ChatUI[])];
			break;

		case "Update":
			const dataKeys = Object.keys(data);
			if (dataKeys.length !== 1) {
				throw Error(`Data must have a lenght of 1 when action is "${action}"`);
			}
			next = [...state];
			const key = Number(dataKeys[0]);
			next[key] = { ...next[key], ...data[key] };
			break;
		default:
			throw Error(`${action} action is not valid`);
	}
	console.group(place || "*********Not specified*********");
	console.log(`Action: ${action}`);
	console.log("Old state: \n");
	console.log(state);
	console.log("Next state: \n");
	console.log(next);
	console.groupEnd();
	return next;
}

export function ChatPage(props: ChatPageProps) {
	const [setLoading] = useLoading();
	const [isConnected, setIsConnected] = useState<boolean>(false);
	const [chatsSt, dispatchChats] = useReducer(chatsReducer, []);
	const chatsRef = useRef(chatsSt);

	useEffect(() => {
		chatsRef.current = chatsSt;
	}, [chatsSt]);

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
			{chatsSt}
		</ChatSection>
	);

	async function onMessage(e: ChatMessageData) {
		const message = await props.source.sendMessage(
			e.msg.content,
			[],
			e.selectedChat
		);

		const messages = chatsRef.current[e.idx].messages;

		messages.push(message);

		dispatchChats({
			action: "Update",
			data: { [e.idx]: { messages: messages } },
			place: `On message sent (${props.user.username})`,
		});
	}

	async function fetchChats() {
		setLoading(true);
		dispatchChats({
			action: "Add",
			data: await props.source.getAllMyChats(),
			place: `onMount start (${props.user.username})`,
		});
		setLoading(false);
	}

	function onMount() {
		{
			props.source.emitter.onConnectionStatusChanged.add(
				updateConnectionStatus
			);

			props.source.emitter.onContactStatusChaged.add(updateContactStatus);

			props.source.emitter.onMessageReceived.add(updateChat);

			props.onConnectionError &&
				props.source.emitter.onError.add(props.onConnectionError);
		}

		props.source.emitter.connect();
	}

	function onUnmount() {
		props.source.emitter.onConnectionStatusChanged.remove(
			updateConnectionStatus
		);

		props.source.emitter.onContactStatusChaged.remove(updateContactStatus);

		props.source.emitter.onMessageReceived.remove(updateChat);

		props.onConnectionError &&
			props.source.emitter.onError.remove(props.onConnectionError);

		props.source.emitter.disconnect();
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
			dispatchChats({
				action: "Update",
				data: { [chatIdx]: { subs: subs } },
				place: `existing user re-connected (${props.user.username})`,
			});
		}
	}

	function updateChat(message: MessageUI, chatId: number) {
		const idx = chatsRef.current.findIndex((chat) => chat.id === chatId);

		const messages = chatsRef.current[idx].messages;

		messages.push(message);

		dispatchChats({
			action: "Update",
			data: { [idx]: { messages: messages } },
			place: `private message (${props.user.username})`,
		});
	}
}
