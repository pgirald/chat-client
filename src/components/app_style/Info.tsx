import { CSSProperties, ReactNode, useContext } from "react";
import { themeContext } from "../../global/Theme";


export type HeaderProps = {
	content: string;
	className?: string;
	style?: CSSProperties;
};

export function Header(props: HeaderProps) {
	return (
		<div
			className={`${props.className} text-sm -:font-Roboto -:text-base -:font-bold`}
			style={props.style}
		>
			{props.content}
		</div>
	);
}

export type InfoProps = {
	header: string;
	content: ReactNode;
	contentClass?: string;
	headerClass?: string;
	headerRight?: ReactNode;
};

export function Info(props: InfoProps) {
	const theme = useContext(themeContext);

	return (
		<div className="-space-y-1">
			<div className="flex-row items-center space-x-1">
				<Header
					className={props.headerClass}
					content={props.header}
					style={{ color: theme.content }}
				/>
				{props.headerRight}
			</div>
			<div
				className={`${props.contentClass} font-Roboto italic text-xs`}
				style={{ color: theme.separator }}
			>
				{props.content}
			</div>
		</div>
	);
}