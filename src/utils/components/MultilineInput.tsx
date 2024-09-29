import {
	CSSProperties,
	FocusEvent,
	ForwardedRef,
	forwardRef,
	RefObject,
	useRef,
} from "react";
import { E } from "../General";
import { preProcessFile } from "typescript";
import { removeScrollBars } from "./DefaultStyles";

export type MutilineInputProps = {
	value?: string;
	defaultValue?: string;
	onChange?: (value: string) => void;
	onBlur?: (e: FocusEvent<HTMLTextAreaElement, Element>) => void;
	className?: string;
	style?: CSSProperties;
};

export const MultilineInput = forwardRef(
	(props: MutilineInputProps, ref?: ForwardedRef<HTMLTextAreaElement>) => {
		return (
			<textarea
				ref={ref}
				defaultValue={props.defaultValue}
				value={props.value}
				className={`${E(props.className)} focus:outline-none overflow-y-scroll`}
				style={{
					...props.style,
					resize: "none",
					whiteSpace: "pre-wrap",
					...removeScrollBars,
				}}
				onChange={(e) => {
					props.onChange?.(e.target.value);
				}}
				onBlur={props.onBlur}
			/>
		);
	}
);
