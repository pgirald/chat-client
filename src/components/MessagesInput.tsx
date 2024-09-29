import {
	CSSProperties,
	FocusEvent,
	ForwardedRef,
	forwardRef,
	useContext,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
} from "react";
import { Modal, ModalHandler } from "./Modal";
import { themeContext } from "../global/Theme";
import { AttachmentsDisplay, FileData } from "./AttachmentsDisplay";
import { IoMdRemoveCircle } from "react-icons/io";
import { FilePickerWrapper } from "./FilePickerWrapper";
import { RiAddBoxFill } from "react-icons/ri";
import { E, getFileExtension, truncateStr } from "../utils";
import { EmojisButton } from "./EmojisButton";
import { MultilineInput } from "../utils/components/MultilineInput";
import { MdSend } from "react-icons/md";
import { PiPaperclipFill } from "react-icons/pi";
import { AttachmentsModal } from "./AttachmentsModal";
import { IconBaseProps, IconType } from "react-icons";

export type MessageInputProps = {
	className?: string;
	style?: CSSProperties;
	value?: string;
	onChange?: (content: string) => void;
	onSendMessage?: (content: string) => void;
	onFilesSelected?: (files: File[]) => void;
	onBlur?: (e: FocusEvent<HTMLTextAreaElement, Element>) => void;
	filesIcon?: IconType;
	defaultValue?: string;
};

export const MessageInput = forwardRef(
	(props: MessageInputProps, ref?: ForwardedRef<HTMLTextAreaElement>) => {
		const inputRef = useRef<HTMLTextAreaElement>(null);
		const theme = useContext(themeContext);

		const iconsSize = 22;

		useImperativeHandle(ref, () => inputRef.current as HTMLTextAreaElement);

		return (
			<div
				className={`-:h-11 -:flex-row -:w-full -:self-center ${E(props.className)}`}
				style={props.style}
			>
				<div className="h-full w-full flex-row border border-black rounded-md">
					<MultilineInput
						ref={inputRef}
						defaultValue={props.defaultValue}
						value={props.value}
						className="font-Roboto w-full max-w-full h-full text-sm bg-transparent pl-2"
						onChange={props.onChange}
						onBlur={props.onBlur}
					/>
					<MdSend
						className="cursor-pointer mx-1 self-center"
						onClick={() => {
							if (!inputRef.current) {
								return;
							}
							props.onSendMessage?.(inputRef.current.value || "");
							inputRef.current.value = "";
						}}
						color={theme.breaker}
						size={iconsSize}
					/>
				</div>

				<div className="h-full w-fit justify-between">
					<EmojisButton
						frameBg={theme.bg}
						inputRef={inputRef}
						theme={theme.emojistTheme}
						color={theme.breaker}
						size={iconsSize}
					/>
					<FilePickerWrapper
						className="cursor-pointer"
						onFilesSelected={props.onFilesSelected}
					>
						{props.filesIcon ? (
							<props.filesIcon size={iconsSize} color={theme.breaker} />
						) : (
							<PiPaperclipFill size={iconsSize} color={theme.breaker} />
						)}
					</FilePickerWrapper>
				</div>
			</div>
		);
	}
);
