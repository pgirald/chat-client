export {};
// import { useEffect, useReducer, useRef, useState } from "react";
// import socket from "../socket";
// import { ChatSection } from "./ChatSection";
// import { Indexed, Optional } from "../utils/Types";
// import { Chat, User } from "chat-api";

// type _User = {
// 	userID: string;
// 	username: string;
// };

// export type ChatPageProps = {
// 	user: User;
// 	onConnectionError?: (e: Error) => void;
// };

// type ChatsActions = "Add" | "Update";

// type ActionData<T> = T extends "Add"
// 	? Indexed<Chat>
// 	: T extends "Update"
// 	? Indexed<Optional<Chat>>
// 	: unknown;

// function chatsReducer(
// 	state: readonly Chat[],
// 	{
// 		action,
// 		data,
// 		place,
// 	}: {
// 		action: ChatsActions;
// 		data: ActionData<typeof action>;
// 		place?: string;
// 	}
// ): Chat[] {
// 	let next: Chat[];
// 	switch (action) {
// 		case "Add":
// 			next = [...state, ...(data as Chat[])];
// 			break;

// 		case "Update":
// 			const dataKeys = Object.keys(data);
// 			if (dataKeys.length != 1) {
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

// export function ChatPage(props: ChatPageProps) {
// 	const [isConnected, setIsConnected] = useState<boolean>(false);
// 	const [chatsSt, dispatchChats] = useReducer(chatsReducer, []);
// 	const chatsRef = useRef(chatsSt);
// 	// const dispatchChatsRef = useRef(dispatchChats);

// 	// useEffect(() => {
// 	// 	dispatchChatsRef.current = dispatchChats;
// 	// });

// 	useEffect(() => {
// 		chatsRef.current = chatsSt;
// 	}, [chatsSt]);

// 	useEffect(() => {
// 		onMount();
// 		return onUnmount;
// 	}, []);

// 	return (
// 		<ChatSection
// 			userConnected={isConnected}
// 			onMessage={onMessage}
// 			user={props.user}
// 			className="h-full w-full"
// 		>
// 			{chatsSt}
// 		</ChatSection>
// 	);

// 	function onMessage(e: { selectedChat: Chat; content: string; idx: number }) {
// 		socket.emit("private message", {
// 			content: e.content,
// 			to: e.selectedChat.contact.user.id,
// 		});

// 		const messages = chatsRef.current[e.idx].messages;

// 		messages.push({
// 			content: e.content,
// 			from: props.user,
// 			time: new Date(Date.now()),
// 		});

// 		dispatchChats({
// 			action: "Update",
// 			data: { [e.idx]: { messages: messages } },
// 			place: `On message sent (${props.user.username})`,
// 		});
// 	}

// 	function onMount() {
// 		{
// 			socket.on("connect", () => {
// 				setIsConnected(true);
// 			});

// 			socket.on("disconnect", () => {
// 				setIsConnected(false);
// 			});

// 			socket.on("users", (users: Array<_User>) => {
// 				dispatchChats({
// 					action: "Add",
// 					data: users
// 						.filter(
// 							(user) =>
// 								!chatsRef.current.some(
// 									(chat) => chat.contact.user.username === user.username
// 								)
// 						)
// 						.map((user): Chat => {
// 							return _User2Chat(user);
// 						}),
// 					place: `Retrieve users (${props.user.username})`,
// 				});
// 			});

// 			socket.on("user connected", (user: _User) => {
// 				const idx = chatsRef.current.findIndex(
// 					(chat) => chat.contact.user.id === user.userID
// 				);
// 				if (idx === -1) {
// 					dispatchChats({
// 						action: "Add",
// 						data: [_User2Chat(user)],
// 						place: `new user connected (${props.user.username})`,
// 					});
// 					return;
// 				}
// 				const contact = chatsRef.current[idx].contact;
// 				contact.isConnected = true;
// 				dispatchChats({
// 					action: "Update",
// 					data: { [idx]: { contact: contact } },
// 					place: `existing user re-connected (${props.user.username})`,
// 				});
// 			});

// 			socket.on("user disconnected", (id) => {
// 				const idx = chatsRef.current.findIndex(
// 					(chat) => chat.contact.user.id === id
// 				);
// 				const contact = chatsRef.current[idx].contact;
// 				contact.isConnected = false;
// 				dispatchChats({
// 					action: "Update",
// 					data: { [idx]: { contact: contact } },
// 					place: `user disconnected (${props.user.username})`,
// 				});
// 			});

// 			socket.on(
// 				"private message",
// 				({ content, from }: { content: string; from: string }) => {
// 					const idx = chatsRef.current.findIndex(
// 						(chat) => chat.contact.user.id === from
// 					);

// 					const messages: Messages[] = chatsRef.current[idx].messages;

// 					messages.push({
// 						content: content,
// 						from: chatsRef.current[idx].contact.user,
// 						time: new Date(Date.now()),
// 					});

// 					dispatchChats({
// 						action: "Update",
// 						data: { [idx]: { messages: messages } },
// 						place: `private message (${props.user.username})`,
// 					});
// 				}
// 			);

// 			socket.on("connect_error", (err) => {
// 				props.onConnectionError?.(err);
// 			});
// 		}

// 		socket.auth = { username: props.user.username };
// 		socket.connect();
// 	}

// 	function onUnmount() {
// 		socket.off("connect");
// 		socket.off("disconnect");
// 		socket.off("users");
// 		socket.off("user connected");
// 		socket.off("user disconnected");
// 		socket.off("private message");
// 		socket.off("connect_error");
// 		socket.disconnect();
// 	}

// 	function _User2Chat(user: _User): Chat {
// 		return {
// 			contact: {
// 				user: { id: user.userID, username: user.username },
// 				isConnected: true,
// 			},
// 			messages: [],
// 			owner: props.user,
// 		};
// 	}
// }
