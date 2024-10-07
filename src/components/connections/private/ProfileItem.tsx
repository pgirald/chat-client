import {
	CSSProperties,
	ForwardedRef,
	forwardRef,
	ReactElement,
	useContext,
} from "react";
import { EditableImg } from "../../reusables/EditableImg";
import { Label } from "../../app_style/Template";
import { themeContext } from "../../../global/Theme";
import { E } from "../../../utils/StringOps";

export type FontProps = { color?: string };

export type ProfileItemProps = {
	onClick?: () => void;
	img: string;
	name: string;
	description: string;
	className?: string;
	style?: CSSProperties;
	font?: FontProps;
	height?: number;
};

export function ProfileItem(
	props: ProfileItemProps
): ReactElement<ProfileItemProps> {
	const theme = useContext(themeContext);
	const imgSize = props.height || 60;

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
