import { CSSProperties } from "react";

export type AppButtonProps = {
	className?: string;
	style?: CSSProperties;
	content?: string;
	onClick?: () => void;
};

export function AppButton(props: AppButtonProps) {
	return (
		<div
			className={`-:rounded-md -:p-2 -:cursor-pointer -:font-Roboto -:text-white -:font-bold -:text-sm -:items-center ${props.className}`}
			style={props.style}
			onClick={props.onClick}
		>
			{props.content}
		</div>
	);
}
