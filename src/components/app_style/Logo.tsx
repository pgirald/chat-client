import { useContext } from "react";
import { languageContext } from "../../global/Language";
import logoIcon from "../../assets/chato logo.png";
import { fixedTheme } from "../../global/Theme";
import { E } from "../../utils/StringOps";

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
