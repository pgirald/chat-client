import { CSSProperties, useContext, useRef, useState } from "react";
import { User } from "chat-api";
import { Chat, MessageData } from "./Chat";
import { ChatUI } from "../Chore/Types";
import { fixedTheme, themeContext, useTheme } from "../global/Theme";
import { BiSolidPlusCircle } from "react-icons/bi";
import { IoSearchSharp } from "react-icons/io5";
import { E } from "../utils";
import { removeScrollBars } from "../utils/components/DefaultStyles";
import { WindowHeader, Label } from "./Styling";
import { languageContext } from "../global/Language";
import { chatImg, chatLabel } from "./utils";
import { userContext } from "../global/User";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { ChatsList } from "./ChatsList";
import { Modal, ModalHandler } from "./Modal";
import { ChatForm } from "./ChatForm";
import { SearchTool } from "./SearchTool";

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
	const theme = useContext(themeContext);
	const toolsHeight = 35;

	return (
		<div className={props.className}>
			<div className="flex-row h-full w-full">
				<div className="w-1/5 h-full">
					<div className="items-start justify-center w-full h-1/6">
						<WindowHeader content={language.messages} />
					</div>
					<div className="flex-row space-x-2 h-fit w-full">
						<SearchTool style={{ height: toolsHeight }} />
						<BiSolidPlusCircle
							className="self-center cursor-pointer mr-2"
							color={theme.breaker}
							size={toolsHeight}
							onClick={() => {
								setSelectedChat({
									id: -1,
									messages: [],
									owner: user,
									subs: [user],
								});
								chatModalRef.current?.openModal();
							}}
						/>
					</div>
					<ChatsList
						className="space-y-2 overflow-y-scroll h-5/6 w-full"
						style={removeScrollBars}
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
				<div className="h-full w-4/5">
					{selectedChat && (
						<>
							<div className="w-full flex-row justify-start items-center space-x-5 h-1/6">
								<img src={chatImg(selectedChat, user)} height={45} width={45} />
								<Label content={chatLabel(selectedChat, user, language)} />
								<div className="flex-row w-full h-fit justify-end">
									<IoSearchSharp className="cursor-pointer" />
									<HiOutlineDotsVertical
										className="cursor-pointer"
										onClick={() => {
											chatModalRef.current?.openModal();
										}}
									/>
								</div>
							</div>
							<Chat
								className="h-5/6 w-full space-y-2"
								chat={selectedChat}
								onMessage={(msgData) => {
									props.onMessage?.({
										msg: msgData,
										selectedChat,
										idx: selectedIdxRef.current!,
									});
								}}
							/>
						</>
					)}
				</div>
			</div>
			{selectedChat && (
				<Modal ref={chatModalRef}>
					<ChatForm chat={selectedChat} />
					{/* <WindowTemplate header={chatLabel(selectedChat, user, language)}>
						<Header content={language.members} />
						<UsersList
							className="max-h-42"
							onUserSelected={(user) => {
								alert(user.username);
							}}
						>
							{selectedChat.subs}
						</UsersList>
					</WindowTemplate> */}
				</Modal>
			)}
		</div>
	);
}
