import { ForwardedRef, forwardRef, useContext, useRef, useState } from "react";
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

export type MessageData = {
	content: string;
	attachments: FileData[];
};

export type ChatProps = {
	className?: string;
};

export const Chat = forwardRef(
	({ className }: ChatProps, ref?: ForwardedRef<HTMLDivElement>) => {
		const [files, setFiles] = useState<File[]>([]);
		const modalRef = useRef<ModalHandler>(null);
		const inputRef = useRef<HTMLTextAreaElement>(null);
		const theme = useContext(themeContext);
		const source = useContext(sourceContext);
		const user = useUser();
		const selectedChat = useChatsStore((store) => store.selectedChat);
		const updateSelectedChat = useChatsStore(
			(store) => store.updateSelectedChat
		);

		return (
			<div ref={ref} className={className}>
				<MessagePanel
					className="h-4/5 border w-full rounded-l-lg"
					style={{ borderColor: theme.separator }}
					messages={selectedChat?.messages || []}
				/>
				<div className="h-1/5 w-full items-center justify-center">
					{selectedChat && (
						<MessageInput
							className="w-2/3 h-2/3"
							ref={inputRef}
							onSendMessage={(content) =>
								onMessage({ content, attachments: [] })
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
							onMessage(msgData);
							modalRef.current?.closeModal();
						}}
						files={files}
					/>
				)}
			</div>
		);

		async function onMessage(md: MessageData) {
			let message: MessageUI = {
				content: md.content,
				attachments: md.attachments,
				receptionTime: new Date(),
				status: "Sending",
				sender: user,
				id: Date.now(),
			};

			const msgIdx = selectedChat!.messages.push(message) - 1;

			updateSelectedChat(selectedChat!);

			message = await source.sendMessage(md.content, md.attachments, selectedChat!);

			selectedChat!.messages[msgIdx] = message;

			updateSelectedChat(selectedChat!);
		}
	}
);
