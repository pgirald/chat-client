import { RiExchangeFill } from "react-icons/ri";
import { fixedTheme } from "../global/Theme";
import { CSSProperties } from "react";

export type EditableImgProps = {
	onChangeRequested?: () => void;
	canChange?: boolean;
	className?: string;
	style?: CSSProperties;
	size?: string | number;
	src?: string;
};

export function EditableImg(props: EditableImgProps) {
	return (
		<div
			className={`-:relative -:items-end -:justify-end aspect-square ${props.className}`}
			style={{ width: props.size, height: props.size, ...props.style }}
		>
			<img
				className="rounded-full h-full w-full"
				src={props.src}
				//height={props.size}
				//width={props.size}
			/>
			{props.canChange && (
				<RiExchangeFill
					className="absolute bg-white rounded-full cursor-pointer"
					color={fixedTheme.logoBlue}
					size={20}
					onClick={props.onChangeRequested}
				/>
			)}
		</div>
	);
}
