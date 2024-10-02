import { CSSProperties, useContext, useState } from "react";
import { themeContext } from "../global/Theme";

export type AppInputProps = {
	className?: string;
	onFocus?: () => void;
	onBlur?: () => void;
	onChange?: (value: string) => void;
	value?: string;
	defaultValue?: string;
	active?: boolean;
	placeholder?: string;
	style?: CSSProperties;
};

export function AppInput(props: AppInputProps) {
	const theme = useContext(themeContext);

	const [editingContent, setEditingContent] = useState(false);

	const value =
		editingContent || props.value ? props.value || "" : props.placeholder || "";

	return (
		<input
			className={`-:font-Roboto -:rounded-r-full ${props.active ? "-:pl-1" : ""} ${props.className}`}
			style={{
				width: props.active ? undefined : `${value.length + 1}ch`,
				userSelect: props.active ? "auto" : "text",
				borderWidth: props.active ? 1 : 0,
				borderColor: theme.separator,
				backgroundColor: theme.bg,
				...props.style,
			}}
			defaultValue={props.defaultValue}
			value={value}
			onChange={(e) => {
				props.onChange?.(e.target.value);
			}}
			onFocus={() => {
				setEditingContent(true);
				props.onFocus?.();
			}}
			onBlur={() => {
				setEditingContent(false);
				props.onBlur?.();
			}}
			readOnly={props.active}
		/>
	);
}
