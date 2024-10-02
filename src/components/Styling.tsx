import { CSSProperties, ReactNode, useContext } from "react";
import { fixedTheme, themeContext } from "../global/Theme";
import { E, empty, isEmpty } from "../utils";
import { languageContext } from "../global/Language";
import logoIcon from "../assets/chato logo.png";
import { IconType } from "react-icons";
import { EditableImg } from "./EditableImg";

export type LabelProps = {
	className?: string;
	style?: CSSProperties;
	content?: ReactNode;
};

export function Label(props: LabelProps) {
	const theme = useContext(themeContext);

	return (
		<div
			className={`rounded-r-full h-fit w-fit pl-1 pr-2 whitespace-nowrap -:text-white -:font-Roboto -:text-sm ${E(props.className)}`}
			style={{
				...props.style,
				backgroundColor: theme.breaker,
			}}
		>
			{props.content}
		</div>
	);
}

export type WindowHeaderProps = {
	content?: ReactNode;
	fringeLenght?: number;
	className?: string;
};

export function WindowHeader(props: WindowHeaderProps) {
	return (
		<div className={`-:-mb-3 ${props.className}`}>
			<Label className="text-2xl font-black py-1" content={props.content} />
			<div
				className="rounded-br-full h-2"
				style={{
					width: props.fringeLenght || 32,
					backgroundColor: fixedTheme.logoOrange,
				}}
			/>
		</div>
	);
}

export type WindowTemplateProps = {
	header?: ReactNode;
	children?: ReactNode;
	className?: string;
	wrapperClassName?: string;
	fringeLenght?: number;
	identation?: number;
};

export function WindowTemplate(props: WindowTemplateProps) {
	const fringeLenght = props.fringeLenght || 32;
	const identation = empty(props.identation) ? fringeLenght : props.identation;

	return (
		<div className={`-:pr-5 -:py-5 ${props.className}`}>
			<WindowHeader
				className="mb-3"
				content={props.header}
				fringeLenght={fringeLenght}
			/>
			<div
				className={`-:h-fit -:w-fit ${props.wrapperClassName}`}
				style={{ paddingLeft: identation }}
			>
				{props.children}
			</div>
		</div>
	);
}

export function Separator() {
	const theme = useContext(themeContext);

	return (
		<div
			className="w-2 h-full rounded-full mx-5"
			style={{ backgroundColor: theme.separator }}
		/>
	);
}

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

export type LogoProps = {
	showIcon?: boolean;
	className?: string;
};

export function Logo(props: LogoProps) {
	const language = useContext(languageContext);
	return (
		<div
			className={`-:flex-row -:font-Krona -:text-1xl -:items-stretch -:space-x-1 ${E(props.className)}`}
		>
			<span className="self-center" style={{ color: fixedTheme.logoOrange }}>
				{language.chat}
			</span>
			{props.showIcon && (
				<img className="h-full aspect-square" src={logoIcon} />
			)}
		</div>
	);
}
