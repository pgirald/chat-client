import { ForwardedRef, forwardRef, useEffect, useRef, useState } from "react";
import { ChatItem } from "./ChatItem";
import { User } from "chat-api";
import { Chat, StatusCard } from "./Chat";
import { ChatUI } from "../Chore/Types";

export type ChatSectionProps = {
	children: ChatUI[];
	userListClass?: string;
	user: User;
	userConnected: boolean;
	className?: string;
	onMessage?: (e: { content: string; selectedChat: ChatUI; idx: number }) => void;
};

export function ChatSection(props: ChatSectionProps) {
	const wrapperRef = useRef<HTMLDivElement>(null);
	const chatRef = useRef<HTMLDivElement>(null);
	const selectedIdxRef = useRef<number>();
	const [selectedChat, setSelectedChat] = useState<ChatUI>();

	useEffect(() => {
		document.addEventListener("click", checkIfClickedOutside);
		return () => {
			document.removeEventListener("click", checkIfClickedOutside);
		};
	}, []);

	return (
		<div className={`${props.className} flex-row`}>
			<div className="h-full w-fit px-2 flex-[1] bg-red-500 text-white space-y-4">
				<StatusCard
					className="font-bold"
					label={props.user.username}
					isConnected={props.userConnected}
				/>
				<ChatList
					className="space-y-2 "
					onChatSelected={(chat, idx) => {
						setSelectedChat(chat);
						selectedIdxRef.current = idx;
					}}
					ref={wrapperRef}
				>
					{props.children}
				</ChatList>
			</div>
			<div className="flex-[3]">
				{selectedChat && (
					<Chat
						chat={selectedChat}
						onMessage={(content) => {
							props.onMessage?.({
								content,
								selectedChat,
								idx: selectedIdxRef.current!,
							});
						}}
						className="h-full w-full space-y-2"
						ref={chatRef}
					/>
				)}
			</div>
		</div>
	);

	function checkIfClickedOutside(e: MouseEvent) {
		if (
			chatRef.current &&
			wrapperRef.current &&
			typeof e.composedPath === "function" &&
			!e.composedPath().includes(wrapperRef.current!) &&
			!e.composedPath().includes(chatRef.current!)
		) {
			setSelectedChat(undefined);
			selectedIdxRef.current = undefined;
		}
	}
}

type ChatListProps = {
	children: ChatUI[];
	className?: string;
	onChatSelected?: (chat: ChatUI, idx: number) => void;
};

const ChatList = forwardRef<HTMLDivElement, ChatListProps>(
	(props: ChatListProps, ref?: ForwardedRef<HTMLDivElement>) => {
		return (
			<div
				className={`${props.className} cursor-pointer w-fit h-fit p-0 m-0`}
				ref={ref}
			>
				{props.children.map((chat, idx) => (
					<ChatItem
						chat={chat}
						onClick={() => {
							props.onChatSelected?.(chat, idx);
						}}
						className="text-white"
					/>
				))}
			</div>
		);
	}
);
