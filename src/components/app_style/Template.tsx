import { CSSProperties, ReactNode, useContext } from "react";
import { fixedTheme, themeContext } from "../../global/Theme";
import { unspecified } from "../../utils/General";
import { E } from "../../utils/StringOps";

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
	const identation = unspecified(props.identation) ? fringeLenght : props.identation;

	return (
		<div className={`-:pr-5 -:pb-5 ${props.className}`}>
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