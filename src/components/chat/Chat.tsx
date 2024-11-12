import {
	ForwardedRef,
	forwardRef,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import { MessagePanel } from "./private/MessagePanel";
import { FileData } from "./private/AttachmentsDisplay";
import { MessageInput } from "./private/MessagesInput";
import { AttachmentsModal } from "./private/AttachmentsModal";
import { ModalHandler } from "../reusables/Modal";
import { themeContext } from "../../global/Theme";
import { ChatUI, MessageUI } from "../../Chore/Types";
import { useUser } from "../../global/User";
import { useChatsStore } from "../../global/Chats";
import { sourceContext } from "../../global/Source";
import { PiDropSimple } from "react-icons/pi";

export type MessageData = {
	content: string;
	attachments: FileData[];
};

export type ChatProps = {
	className?: string;
	messagesPerPage?: number;
	messagesPageNumber?: number;
};

export const Chat = forwardRef(
	(
		{ className, messagesPerPage, messagesPageNumber }: ChatProps,
		ref?: ForwardedRef<HTMLDivElement>
	) => {
		const [files, setFiles] = useState<File[]>([]);
		const modalRef = useRef<ModalHandler>(null);
		const inputRef = useRef<HTMLTextAreaElement>(null);
		const selectedChatRef = useRef<ChatUI>();
		const firstMessageReachedRef = useRef(false);

		const theme = useContext(themeContext);
		const source = useContext(sourceContext);
		const user = useUser();
		const selectedChat = useChatsStore((store) => store.selectedChat);
		const updateSelectedChat = useChatsStore(
			(store) => store.updateSelectedChat
		);

		useEffect(() => {
			firstMessageReachedRef.current = false;
		}, [selectedChat?.id]);

		useEffect(() => {
			selectedChatRef.current = selectedChat;
		}, [selectedChat]);

		return (
			<div ref={ref} className={className}>
				<MessagePanel
					className="h-4/5 border w-full rounded-l-lg"
					style={{ borderColor: theme.separator }}
					itemsPerPage={messagesPerPage}
					pageNumber={messagesPageNumber}
					onFirstMessageReached={() => {
						firstMessageReachedRef.current = true;
					}}
				/>
				<div className="h-1/5 w-full items-center justify-center">
					{selectedChat && (
						<MessageInput
							className="w-2/3 h-2/3"
							ref={inputRef}
							onSendMessage={(content) =>
								onMessageSend({ content, attachments: [] })
							}
							onFilesSelected={(files) => {
								setFiles(files);
								modalRef.current?.openModal();
							}}
						/>
					)}
				</div>
				{selectedChat && (
					<AttachmentsModal
						ref={modalRef}
						defaultValue={inputRef.current?.value}
						onAccept={(msgData) => {
							if (inputRef.current) {
								inputRef.current.value = "";
							}
							onMessageSend(msgData);
							modalRef.current?.closeModal();
						}}
						files={files}
					/>
				)}
			</div>
		);

		async function onMessageSend(md: MessageData) {
			if (!selectedChatRef.current) {
				return;
			}

			let message: MessageUI = {
				content: md.content,
				attachments: md.attachments,
				receptionTime: new Date(),
				status: "Sending",
				sender: user,
				id: Date.now(),
			};

			if (!firstMessageReachedRef.current) {
				selectedChatRef.current.messages.shift();
			}

			const msgIdx = selectedChatRef.current.messages.push(message) - 1;

			selectedChatRef.current.messages = [...selectedChatRef.current.messages];

			updateSelectedChat(selectedChatRef.current);

			message = await source.sendMessage(
				md.content,
				md.attachments,
				selectedChatRef.current
			);

			selectedChatRef.current.messages[msgIdx] = message;

			updateSelectedChat(selectedChatRef.current);
		}
	}
);
