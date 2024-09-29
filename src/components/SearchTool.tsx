import { CSSProperties, useContext, useRef } from "react";
import { fixedTheme, themeContext } from "../global/Theme";
import { IoSearchSharp } from "react-icons/io5";
import { BiSolidPlusCircle } from "react-icons/bi";
import { E } from "../utils";

export type SearchToolProps = {
	onSearchRequested?: (value: string) => void;
	onSearchChange?: (value: string) => void;
	className?: string;
	style?: CSSProperties;
	search?: boolean;
	value?: string;
};

export function SearchTool(props: SearchToolProps) {
	const inputRef = useRef<HTMLInputElement>(null);
	const theme = useContext(themeContext);

	return (
		<div
			className={`${E(props.className)} -:h-9 -:w-full -:pl-5`}
			style={{ backgroundColor: theme.breaker, ...props.style }}
		>
			<div
				className="flex-row self-end h-full w-full rounded-l-full pl-3 py-1"
				style={{ backgroundColor: theme.bg }}
			>
				<div
					className="flex-row border w-full self-center rounded-full items-center h-full pl-1"
					style={{
						borderColor: fixedTheme.borderGray,
					}}
				>
					{props.search && (
						<IoSearchSharp
							onClick={() => {
								props.onSearchRequested?.(inputRef.current?.value || "");
							}}
							className="cursor-pointer mx-1"
							color={theme.content}
							size={20}
						/>
					)}
					<input
						ref={inputRef}
						style={{
							all: "unset",
							width: "100%",
							fontFamily: "Roboto",
							fontSize: 12,
						}}
						onChange={(e) => {
							props.onSearchChange?.(e.target.value);
						}}
						value={props.value}
					/>
				</div>
			</div>
		</div>
	);
}
