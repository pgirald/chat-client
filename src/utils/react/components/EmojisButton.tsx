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
import Picker from "@emoji-mart/react";
import { setNativeValue } from "../../HTML_native";
import smile from "../../../assets/smile.svg";
import { CloseFrame } from "../../../components/reusables/CloseFrame";
import { empty } from "../../General";
import { E } from "../../StringOps";

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
	const frameRef = useRef<HTMLDivElement>(null);

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

	useEffect(() => {
		if (!showEmos || !componentRef.current || !frameRef.current) {
			return;
		}

		const parentRect = componentRef.current.getBoundingClientRect();
		const componentRect = frameRef.current.getBoundingClientRect();

		// By default, place the component at the top-right of the parent
		let bottom = window.innerHeight - parentRect.top;
		let left = parentRect.left + parentRect.width;
		let top = window.innerHeight - bottom - componentRect.height;
		let right = window.innerWidth - left - componentRect.width;

		console.log(`t:${top} r:${right} b:${bottom} l:${left}`);

		if (top < 0) {
			bottom = window.innerHeight - componentRect.height; // Reposition to the top of the screen
		}
		if (left < 0) {
			left = 0; // Reposition to the left of the screen
		}
		if (right < 0) {
			left = window.innerWidth - componentRect.width; // Stay within screen's right edge
		}
		if (bottom < 0) {
			bottom = 0; // Stay within screen's bottom edge
		}

		// Apply the new position
		frameRef.current.style.bottom = `${bottom}px`;
		frameRef.current.style.left = `${left}px`;
	}, [showEmos]);

	return (
		<div
			ref={componentRef}
			className={`relative w-fit h-fit self-center p-0 m-0 ${E(props.className)}`}
			style={props.style}
		>
			{showEmos && (
				<CloseFrame
					className="fixed rounded-md overflow-auto border h-[500px] w-64"
					style={{
						//visibility: showEmos ? "visible" : "hidden",
						backgroundColor: props.frameBg,
					}}
					onCloseRequested={() => {
						setShowEmos(false);
					}}
					ref={frameRef}
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
				<img
					className="icon"
					src={smile}
					style={{ backgroundColor: props.color, padding: 6 }}
					width={props.size}
					height={props.size}
					onClick={() => {
						if (showEmos) {
							setShowEmos(false);
						} else {
							setShowEmos(true);
						}
					}}
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
