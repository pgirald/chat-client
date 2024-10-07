import { CSSProperties, ReactNode, useContext } from "react";
import { themeContext } from "../../global/Theme";

export type LabelProps = {
	className?: string;
	style?: CSSProperties;
	content?: ReactNode;
};

export function Separator() {
	const theme = useContext(themeContext);

	return (
		<div
			className="w-2 h-full rounded-full mx-5"
			style={{ backgroundColor: theme.separator }}
		/>
	);
}