import { CSSProperties, useContext, useRef, useState } from "react";
import { User } from "chat-api";
import { Chat, MessageData } from "./Chat";
import { ChatUI } from "../Chore/Types";
import { fixedTheme, themeContext, useTheme } from "../global/Theme";
import { BiSolidPlusCircle } from "react-icons/bi";
import { IoSearchSharp } from "react-icons/io5";
import { WindowHeader, Label } from "./Styling";
import { languageContext } from "../global/Language";
import { chatImg, chatLabel } from "./utils";
import { userContext } from "../global/User";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { ChatsList } from "./ChatsList";
import { Modal, ModalHandler } from "./Modal";
import { ChatForm } from "./ChatForm";
import { SearchTool } from "./SearchTool";
import { EditableImg } from "./EditableImg";
import { BsPlus } from "react-icons/bs";

export type ChatMessageData = {
	msg: MessageData;
	selectedChat: ChatUI;
	idx: number;
};

export type ChatSectionProps = {
	children: ChatUI[];
	userListClass?: string;
	userConnected: boolean;
	className?: string;
	style?: CSSProperties;
	onMessage?: (e: ChatMessageData) => void;
	onChatSelected?: (chat: ChatUI, idx: number) => void;
};

export type StatusCardProps = {
	isConnected: boolean;
	label: string;
	className?: string;
};

export function ChatSection(props: ChatSectionProps) {
	const selectedIdxRef = useRef<number>();
	const [selectedChat, setSelectedChat] = useState<ChatUI>();
	const user = useContext(userContext);
	const language = useContext(languageContext);
	const chatModalRef = useRef<ModalHandler>(null);
	const newChatModalRef = useRef<ModalHandler>(null);
	const theme = useContext(themeContext);
	const toolsHeight = 40;
	const iconsSize = 20;

	return (
		<div className={props.className} style={props.style}>
			<div className="flex-row h-full w-full">
				<div className="w-[30%] h-full">
					<div className="items-start justify-center w-full h-1/5">
						<WindowHeader content={language.messages} />
					</div>
					<div className="flex-row space-x-2 h-fit w-full items-center">
						<SearchTool
							style={{ height: toolsHeight }}
							showLen
							lenSize={iconsSize}
						/>
						<div className="p-1">
							<BsPlus
								className="icon"
								style={{
									backgroundColor: theme.breaker,
								}}
								size={toolsHeight-6}
								strokeWidth="0.5px"
								color="white"
								onClick={() => {
									newChatModalRef.current?.openModal();
								}}
							/>
						</div>
					</div>
					<ChatsList
						className="space-y-2 overflow-y-scroll h-5/6 w-full"
						onChatSelected={(chat, idx) => {
							setSelectedChat(chat);
							selectedIdxRef.current = idx;
							props.onChatSelected?.(chat, idx);
						}}
						selected={selectedIdxRef.current}
					>
						{props.children}
					</ChatsList>
				</div>
				<div className="h-full w-[70%]">
					<div
						className="w-full flex-row justify-start items-center space-x-2 h-1/5"
						style={{ color: theme.content, backgroundColor: theme.bg }}
					>
						{selectedChat && (
							<>
								<EditableImg src={chatImg(selectedChat, user)} size={70} />
								<Label content={chatLabel(selectedChat, user, language)} />
								<div className="flex-row w-full h-fit justify-end">
									<IoSearchSharp className="cursor-pointer" size={iconsSize} />
									<HiOutlineDotsVertical
										className="cursor-pointer"
										onClick={() => {
											chatModalRef.current?.openModal();
										}}
										size={iconsSize}
									/>
								</div>
							</>
						)}
					</div>
					<Chat
						className="h-5/6 w-full"
						chat={selectedChat}
						onMessage={(msgData) => {
							const chat = selectedChat!;
							props.onMessage?.({
								msg: msgData,
								selectedChat: chat,
								idx: selectedIdxRef.current!,
							});
						}}
					/>
				</div>
			</div>
			<Modal ref={newChatModalRef}>
				<ChatForm
					chat={{
						id: -1,
						messages: [],
						owner: user,
						subs: [user],
					}}
				/>
			</Modal>
			{selectedChat && (
				<Modal ref={chatModalRef}>
					<ChatForm chat={selectedChat} />
				</Modal>
			)}
		</div>
	);
}
