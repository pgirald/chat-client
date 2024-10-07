import { ForwardedRef, forwardRef, useContext, useRef, useState } from "react";
import { MessagePanel } from "./private/MessagePanel";
import { FileData } from "./private/AttachmentsDisplay";
import { MessageInput } from "./private/MessagesInput";
import { AttachmentsModal } from "./private/AttachmentsModal";
import { ModalHandler } from "../reusables/Modal";
import { themeContext } from "../../global/Theme";
import { ChatUI } from "../../Chore/Types";

export type MessageData = {
	content: string;
	attachments: FileData[];
};

export type ChatProps = {
	chat?: ChatUI;
	onMessage?: (content: MessageData) => void;
	className?: string;
};

export const Chat = forwardRef(
	(
		{ chat, onMessage, className }: ChatProps,
		ref?: ForwardedRef<HTMLDivElement>
	) => {
		const [files, setFiles] = useState<File[]>([]);
		const modalRef = useRef<ModalHandler>(null);
		const inputRef = useRef<HTMLTextAreaElement>(null);
		const theme = useContext(themeContext);

		return (
			<div ref={ref} className={className}>
				<MessagePanel
					className="h-4/5 border w-full rounded-l-lg"
					style={{ borderColor: theme.separator }}
					messages={chat?.messages || []}
				/>
				<div className="h-1/5 w-full items-center justify-center">
					{chat && (
						<MessageInput
							className="w-2/3 h-2/3"
							ref={inputRef}
							onSendMessage={(content) =>
								onMessage?.({ content, attachments: [] })
							}
							onFilesSelected={(files) => {
								setFiles(files);
								modalRef.current?.openModal();
							}}
						/>
					)}
				</div>
				{chat && (
					<AttachmentsModal
						ref={modalRef}
						defaultValue={inputRef.current?.value}
						onAccept={(msgData) => {
							if (inputRef.current) {
								inputRef.current.value = "";
							}
							onMessage?.(msgData);
							modalRef.current?.closeModal();
						}}
						files={files}
					/>
				)}
			</div>
		);
	}
);
