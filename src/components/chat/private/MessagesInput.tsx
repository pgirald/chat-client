import {
	CSSProperties,
	FocusEvent,
	ForwardedRef,
	forwardRef,
	ReactNode,
	useContext,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
} from "react";
import { IoMdRemoveCircle } from "react-icons/io";
import { RiAddBoxFill } from "react-icons/ri";
import { MdSend } from "react-icons/md";
import { PiPaperclip, PiPaperclipFill } from "react-icons/pi";
import { AttachmentsModal } from "./AttachmentsModal";
import { IconBaseProps, IconType } from "react-icons";
import { themeContext } from "../../../global/Theme";
import { languageContext } from "../../../global/Language";
import { E } from "../../../utils/StringOps";
import { MultilineInput } from "../../../utils/react/components/MultilineInput";
import { EmojisButton } from "../../../utils/react/components/EmojisButton";
import { FilePickerWrapper } from "../../../utils/react/components/FilePickerWrapper";

export type MessageInputProps = {
	className?: string;
	style?: CSSProperties;
	value?: string;
	onChange?: (content: string) => void;
	onSendMessage?: (content: string) => void;
	onFilesSelected?: (files: File[]) => void;
	onBlur?: (e: FocusEvent<HTMLTextAreaElement, Element>) => void;
	filesIcon?: ReactNode;
	defaultValue?: string;
	iconsSize?: number;
};

export const MessageInput = forwardRef(
	(props: MessageInputProps, ref?: ForwardedRef<HTMLTextAreaElement>) => {
		const inputRef = useRef<HTMLTextAreaElement>(null);
		const theme = useContext(themeContext);
		const language = useContext(languageContext);

		const iconsSize = props.iconsSize || 28;

		useImperativeHandle(ref, () => inputRef.current as HTMLTextAreaElement);

		return (
			<div
				className={`-:h-11 -:flex-row -:w-full -:self-center ${E(props.className)}`}
				style={props.style}
			>
				<div
					className="h-full w-full flex-row border border-black rounded-md bg-white "
					style={{
						borderWidth: 1,
						background: theme.bg,
						color: theme.content,
						borderColor: theme.separator,
					}}
				>
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

				<div className="h-full w-fit justify-between pl-1">
					<EmojisButton
						frameBg={theme.bg}
						inputRef={inputRef}
						theme={theme.emojistTheme}
						color={theme.breaker}
						size={iconsSize}
						language={language.locale as any}
					/>

					<FilePickerWrapper
						className="cursor-pointer"
						onFilesSelected={props.onFilesSelected}
					>
						{props.filesIcon ? (
							props.filesIcon
						) : (
							<PiPaperclip
								className="icon"
								size={iconsSize}
								color="white"
								style={{ backgroundColor: theme.breaker }}
							/>
						)}
					</FilePickerWrapper>
				</div>
			</div>
		);
	}
);
