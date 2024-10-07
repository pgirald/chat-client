import { CSSProperties, ForwardedRef, forwardRef, ReactNode } from "react";
import { BsXLg } from "react-icons/bs";
import { fixedTheme } from "../../global/Theme";
import { E } from "../../utils/StringOps";

export type CloseFrameProps = {
	children: ReactNode;
	onCloseRequested?: () => void;
	margin?: number;
	iconSize?: number;
	className?: string;
	wrapperClassName?: string;
	wrapperStyle?: CSSProperties;
	style?: CSSProperties;
};

export const CloseFrame = forwardRef(
	(props: CloseFrameProps, ref?: ForwardedRef<HTMLDivElement>) => {
		return (
			<div
				className={`-:items-end -:h-fit -:w-fit ${E(props.className)}`}
				style={props.style}
				ref={ref}
			>
				<BsXLg
					className="icon"
					color="white"
					style={{ backgroundColor: fixedTheme.red, margin: 4 }}
					strokeWidth={1}
					onClick={props.onCloseRequested}
					size={props.iconSize || 25}
				/>
				<div
					className={props.wrapperClassName}
					style={{ ...props.wrapperStyle }}
				>
					{props.children}
				</div>
			</div>
		);
	}
);
