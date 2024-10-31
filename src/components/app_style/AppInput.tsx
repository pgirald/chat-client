import { CSSProperties, useContext, useRef, useState } from "react";
import { themeContext } from "../../global/Theme";
import { BsPencilSquare } from "react-icons/bs";

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
	showEdit?: boolean;
	editSize?: number | string;
};

export function AppInput(props: AppInputProps) {
	const theme = useContext(themeContext);

	const [editingContent, setEditingContent] = useState(false);

	const inputRef = useRef<HTMLInputElement>(null);

	const value =
		editingContent || props.value ? props.value || "" : props.placeholder || "";

	return (
		<div
			className={`-:flex-row -:space-x-2 ${props.className}`}
			style={{
				paddingTop: props.active ? 2 : 0,
				width: props.active ? undefined : `${value.length + 1}ch`,
				borderBottomWidth: props.active ? 1 : 0,
				borderColor: theme.separator,
				backgroundColor: theme.bg,
				...props.style,
			}}
		>
			<input
				ref={inputRef}
				className="font-Roboto outline-none w-full bg-transparent"
				style={{ fontStyle: "inherit" }}
				defaultValue={props.defaultValue}
				value={value}
				onChange={(e) => {
					props.onChange?.(e.target.value);
				}}
				onFocus={() => {
					if (!props.active) {
						return;
					}
					setEditingContent(true);
					props.onFocus?.();
				}}
				onBlur={() => {
					if (!props.active) {
						return;
					}
					setEditingContent(false);
					props.onBlur?.();
				}}
				readOnly={!props.active}
			/>
			{props.showEdit && (
				<BsPencilSquare
					className="cursor-pointer self-center"
					color={theme.content}
					size={props.editSize}
					onClick={() => {
						inputRef.current?.select();
					}}
				/>
			)}
		</div>
	);
}
