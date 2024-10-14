import { CSSProperties, useContext, useRef, useState } from "react";
import { User } from "chat-api";
import { ChatUI } from "../Chore/Types";
import { themeContext } from "../global/Theme";
import { BiSolidPlusCircle } from "react-icons/bi";
import { IoSearchSharp } from "react-icons/io5";
import { languageContext } from "../global/Language";
import { chatImg, chatLabel } from "../Chore/view";
import { useUser } from "../global/User";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { ChatsList } from "./connections/ChatsList";
import { Modal, ModalHandler } from "./reusables/Modal";
import { ChatForm } from "./repo_components/ChatRepoForm";
import { EditableImg } from "./reusables/EditableImg";
import { BsPlus } from "react-icons/bs";
import { Chat, MessageData } from "./chat/Chat";
import { Label, WindowHeader } from "./app_style/Template";
import { SearchTool } from "./app_style/SearchTool";
import { sourceContext } from "../global/Source";
import { usePromiseAwaiter } from "../global/Loading";
import { useChats } from "../global/Chats";
import { empty } from "../utils/General";

export type ChatMessageData = {
	msg: MessageData;
	selectedChat: ChatUI;
	idx: number;
};

export type ChatSectionProps = {
	userListClass?: string;
	userConnected: boolean;
	className?: string;
	style?: CSSProperties;
	onMessage?: (e: ChatMessageData) => void;
	onChatSelected?: (chat: ChatUI, idx: number) => void;
};

export function ChatSection(props: ChatSectionProps) {
	const [selectedIdx, setSelectedIdx] = useState<number>(-1);
	const user = useUser();
	const language = useContext(languageContext);
	const source = useContext(sourceContext);
	const [chats, setChats] = useChats();
	const updateChatAwaiter = usePromiseAwaiter(
		(controller?, params?: { chat: ChatUI }) =>
			source.updateChat(params!.chat, controller),
		true
	);
	const chatModalRef = useRef<ModalHandler>(null);
	const newChatModalRef = useRef<ModalHandler>(null);
	const theme = useContext(themeContext);
	const toolsHeight = 40;
	const iconsSize = 20;

	return (
		<div
			className={props.className}
			style={{ backgroundColor: theme.bg, ...props.style }}
		>
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
								size={toolsHeight - 6}
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
							setSelectedIdx(idx);
							props.onChatSelected?.(chat, idx);
						}}
						selected={selectedIdx === -1 ? undefined : selectedIdx}
					>
						{chats}
					</ChatsList>
				</div>
				<div className="h-full w-[70%]">
					<div
						className="w-full flex-row justify-start items-center space-x-2 h-1/5"
						style={{ color: theme.content, backgroundColor: theme.bg }}
					>
						{selectedIdx !== -1 && (
							<>
								<EditableImg
									src={chatImg(chats[selectedIdx], user)}
									size={70}
								/>
								<Label
									content={chatLabel(chats[selectedIdx], user, language)}
								/>
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
						chat={selectedIdx === -1 ? undefined : chats[selectedIdx]}
						onMessage={(msgData) => {
							const chat = chats[selectedIdx];
							props.onMessage?.({
								msg: msgData,
								selectedChat: chat,
								idx: selectedIdx,
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
			{selectedIdx !== -1 && (
				<Modal ref={chatModalRef}>
					<ChatForm
						chat={chats[selectedIdx]}
						onConfirm={async (chat) => {
							const updatedChat = await updateChatAwaiter({ chat: chat });
							if (updatedChat) {
								chats[selectedIdx] = updatedChat;
								setChats([...chats]);
							}
						}}
					/>
				</Modal>
			)}
		</div>
	);
}
