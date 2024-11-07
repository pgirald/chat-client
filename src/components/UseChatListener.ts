import { useContext, useEffect, useReducer, useRef, useState } from "react";
import socket from "../socket";
import { ChatMessageData, ChatSection } from "./ChatSection";
import { Indexed, Optional } from "../utils/Types";
import { AttachmentData, ContactStatusData } from "chat-api";
import { ChatUI, MessageUI, UserUI } from "../Chore/Types";
import { sourceContext } from "../global/Source";
import { range } from "../utils/objectOps";
import { useLoading } from "../global/Loading";
import { useChatsStore } from "../global/Chats";

type _User = {
	userID: string;
	username: string;
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

export function useChatListener(onConnectionError?: (e: Error) => void) {
	const [setLoading] = useLoading();
	const [isConnected, setIsConnected] = useState<boolean>(false);
	const chats = useChatsStore((store) => store.requestedChats);
	const replaceChats = useChatsStore((store) => store.replaceChats);
	const updateChats = useChatsStore((store) => store.updateChats);
	const chatsRef = useRef(chats);
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
	},[]);

	return isConnected;

	//In the Next transition, the page will be pre-rendered with the first page of chats
	async function fetchChats() {
		setLoading(true);
		replaceChats(await source.getAllMyChats());
		setLoading(false);
	}

	function onMount() {
		{
			source.emitter.onConnectionStatusChanged.add(updateConnectionStatus);

			source.emitter.onContactStatusChaged.add(updateContactStatus);

			source.emitter.onMessageReceived.add(updateChat);

			onConnectionError &&
				source.emitter.onError.add(onConnectionError);
		}

		source.emitter.connect();
	}

	function onUnmount() {
		source.emitter.onConnectionStatusChanged.remove(updateConnectionStatus);

		source.emitter.onContactStatusChaged.remove(updateContactStatus);

		source.emitter.onMessageReceived.remove(updateChat);

		onConnectionError &&
			source.emitter.onError.remove(onConnectionError);

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

		const affected: ChatUI[] = [];
		let chatIdx, subIdx: number;
		let chat: ChatUI;

		for (const _idxs of idxs) {
			[chatIdx, subIdx] = _idxs;
			chat = chatsRef.current[chatIdx];
			chat.subs[subIdx].connected = statusData.connected;
			affected.push(chat);
		}

		updateChats(affected);
	}

	function updateChat(message: MessageUI, chatId: number) {
		const chat = chatsRef.current.find((chat) => chat.id === chatId)!;

		chat.messages.push(message);

		updateChats([chat]);
	}
}
