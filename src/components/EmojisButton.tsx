import {
	CSSProperties,
	ForwardedRef,
	forwardRef,
	MutableRefObject,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import { MessageData } from "./Chat";
import { Modal, ModalHandler } from "./Modal";
import { themeContext } from "../global/Theme";
import { AttachmentsDisplay, FileData } from "./AttachmentsDisplay";
import { IoMdRemoveCircle } from "react-icons/io";
import { FilePickerWrapper } from "./FilePickerWrapper";
import { RiAddBoxFill } from "react-icons/ri";
import { E, empty, getFileExtension, truncateStr } from "../utils";
import { CloseFrame } from "./utils";
import Picker from "@emoji-mart/react";
import { setNativeValue } from "../utils/HTML_native";
import { PiSmileyFill } from "react-icons/pi";

type InputSelection = { start?: number; end?: number };

export type EmojisButtonProps = {
	color?: string;
	size?: string | number;
	inputRef: MutableRefObject<HTMLInputElement | HTMLTextAreaElement | null>;
	language?: "en" | "es";
	theme?: "light" | "dark";
	frameBg?: string;
	className?: string;
	style?: CSSProperties;
};

export function EmojisButton(props: EmojisButtonProps) {
	const [showEmos, setShowEmos] = useState(false);
	const selectionRef = useRef<InputSelection>({
		start: props.inputRef.current?.value.length,
		end: props.inputRef.current?.value.length,
	});
	const componentRef = useRef<HTMLDivElement>(null);
	const pickerRef = useRef<HTMLDivElement>(null);
	const buttonRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const inputElm = props.inputRef.current!;
		inputElm.addEventListener("blur", updateInputSelection);
		return () => {
			inputElm.removeEventListener("blur", updateInputSelection);
		};
	}, []);

	useEffect(() => {
		document.addEventListener("click", closeWhenClickedOutside);
		document.addEventListener("click", onEmosInputClicked);
		document.addEventListener("click", refocusInput);
		return () => {
			document.removeEventListener("click", closeWhenClickedOutside);
			document.removeEventListener("click", onEmosInputClicked);
			document.removeEventListener("click", refocusInput);
		};
	}, []);

	return (
		<div
			ref={componentRef}
			className={`relative w-fit h-fit self-center p-0 m-0 ${E(props.className)}`}
			style={props.style}
		>
			{showEmos && (
				<CloseFrame
					className="absolute left-full bottom-full rounded-md"
					style={{
						backgroundColor: props.frameBg,
					}}
					onCloseRequested={() => {
						setShowEmos(false);
					}}
				>
					<div ref={pickerRef}>
						<Picker
							emojiButtonSize={25}
							emojiSize={20}
							locale={props.language || "en"}
							theme={props.theme || "light"}
							emojiVersion={1}
							onEmojiSelect={(ecd: any) => {
								if (!props.inputRef.current) {
									return;
								}

								const start = selectionRef.current.start;
								const end = selectionRef.current.end;

								if (empty(start) || empty(end)) {
									return;
								}

								const content = props.inputRef.current.value;

								const contentStart = content.slice(0, start) + ecd.native;

								selectionRef.current.start = selectionRef.current.end =
									contentStart.length;

								dispatchOnChange(contentStart + content.slice(end));
							}}
						/>
					</div>
				</CloseFrame>
			)}
			<div ref={buttonRef}>
				<PiSmileyFill
					className="cursor-pointer p-0 m-0"
					color={props.color}
					onClick={() => {
						if (showEmos) {
							setShowEmos(false);
						} else {
							setShowEmos(true);
						}
					}}
					size={props.size || 30}
				/>
			</div>
		</div>
	);

	function closeWhenClickedOutside(e: MouseEvent) {
		if (
			props.inputRef.current &&
			componentRef.current &&
			typeof e.composedPath === "function" &&
			!e.composedPath().includes(props.inputRef.current) &&
			!e.composedPath().includes(componentRef.current)
		) {
			setShowEmos(false);
		}
	}

	function updateInputSelection(e: Event) {
		if (!(e instanceof FocusEvent)) {
			return;
		}
		if (!(e.target instanceof HTMLTextAreaElement)) {
			return;
		}
		const newSelection = {
			start: e.target.selectionStart,
			end: e.target.selectionEnd,
		};

		selectionRef.current = newSelection;
	}

	function onEmosInputClicked(e: MouseEvent) {
		if (
			pickerRef.current &&
			typeof e.composedPath === "function" &&
			e.composedPath().includes(pickerRef.current) &&
			e
				.composedPath()
				.some((elm) => elm instanceof Element && elm.nodeName === "INPUT")
		) {
			selectionRef.current.start = selectionRef.current.end;
		}
	}

	function refocusInput(e: MouseEvent) {
		if (!(typeof e.composedPath === "function")) {
			return;
		}
		if (!props.inputRef.current) {
			return;
		}
		if (
			(pickerRef.current &&
				e.composedPath().includes(pickerRef.current) &&
				!e
					.composedPath()
					.some((elm) => elm instanceof Element && elm.nodeName === "INPUT")) ||
			(buttonRef.current && e.composedPath().includes(buttonRef.current))
		) {
			props.inputRef.current?.focus();

			props.inputRef.current.selectionStart =
				selectionRef.current.start || null;

			props.inputRef.current.selectionEnd = selectionRef.current.end || null;
		}
	}

	function dispatchOnChange(newValue: string) {
		if (!props.inputRef.current) {
			return;
		}
		setNativeValue(props.inputRef.current, newValue);
		const event = new Event("change", { bubbles: true });
		props.inputRef.current.dispatchEvent(event);
	}
}
