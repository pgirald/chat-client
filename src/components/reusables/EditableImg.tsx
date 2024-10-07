import { RiExchangeFill } from "react-icons/ri";
import { fixedTheme } from "../../global/Theme";
import { CSSProperties, useEffect, useState } from "react";
import { CgArrowsExchange } from "react-icons/cg";
import notFoundImg from "../../assets/not_found.png";

export type EditableImgProps = {
	onChangeRequested?: () => void;
	canChange?: boolean;
	changeSize?: number;
	className?: string;
	style?: CSSProperties;
	size?: string | number;
	src?: string;
};

export function EditableImg(props: EditableImgProps) {
	const [src, setSrc] = useState(props.src);

	useEffect(() => {
		setSrc(props.src);
	}, [props.src]);

	return (
		<div
			className={`-:relative -:items-end -:justify-end aspect-square ${props.className}`}
			style={{ width: props.size, height: props.size, ...props.style }}
		>
			<img
				className="rounded-full h-full w-full"
				src={src}
				onError={() => {
					setSrc(notFoundImg);
				}}
				//height={props.size}
				//width={props.size}
			/>
			{props.canChange && (
				<CgArrowsExchange
					className="icon"
					style={{
						position: "absolute",
						backgroundColor: fixedTheme.logoBlue,
						padding: 0,
					}}
					color="white"
					size={props.changeSize || 20}
					onClick={props.onChangeRequested}
				/>
			)}
		</div>
	);
}
