import { CSSProperties } from "react";
import { fixedTheme } from "../Global/Theme";

type StatusIconProps = {
	isConnected: boolean;
	iconSize?: number;
	showLabel?: boolean;
};

export function StatusIcon(props: StatusIconProps) {
	const iconSize = props.iconSize || 10;
	const showLabel = props.showLabel !== undefined ? props.showLabel : true;
	const iconStyle: CSSProperties = {
		backgroundColor: props.isConnected ? fixedTheme.green : fixedTheme.red,
		width: iconSize,
		height: iconSize,
	};
	return (
		<div className="flex-row items-center space-x-1">
			<span style={iconStyle} className="rounded-full" />
			<span className="font-roboto font-normal text-[12px]">
				{showLabel && (props.isConnected ? "Online" : "Offline")}
			</span>
		</div>
	);
}
