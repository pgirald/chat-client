import {
	CSSProperties,
	ForwardedRef,
	forwardRef,
	ReactElement,
	useContext,
} from "react";
import { StyleSheet } from "../utils/Types";
import { Language, languageContext } from "../global/Language";
import { chatImg, chatLabel, subsConnected } from "./utils";
import { ChatUI } from "../Chore/Types";
import { userContext } from "../global/User";
import { fixedTheme, themeContext } from "../global/Theme";
import { E, truncateStr } from "../utils";
import { Label } from "./Styling";
import { EditableImg } from "./EditableImg";

export type FontProps = { color?: string };

export type ProfileItemProps = {
	onClick?: () => void;
	img: string;
	name: string;
	description: string;
	className?: string;
	style?: CSSProperties;
	font?: FontProps;
};

export function ProfileItem(
	props: ProfileItemProps
): ReactElement<ProfileItemProps> {
	const theme = useContext(themeContext);
	const imgSize = 60;

	return (
		<div
			role="ChatItem"
			className={`${E(props.className)} -:cursor-pointer -:flex-row -:space-x-3`}
			style={props.style}
			onClick={(e) => {
				props.onClick?.();
			}}
		>
			<EditableImg size={imgSize} src={props.img} />
			<div className="space-y-0" style={{ height: imgSize }}>
				<Label content={props.name} />
				<div
					style={{ color: props.font?.color || theme.content }}
					className="w-full h-full font-Roboto text-xs overflow-hidden pr-8"
				>
					{props.description}
				</div>
			</div>
		</div>
	);
}
