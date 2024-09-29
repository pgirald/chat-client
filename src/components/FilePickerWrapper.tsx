import { CSSProperties, ReactNode, useRef } from "react";

export type FilePickerWrapperProps = {
	children: ReactNode;
	onFilesSelected?: (files: File[]) => void;
	className?: string;
	style?: CSSProperties;
};

export function FilePickerWrapper(props: FilePickerWrapperProps) {
	const inputRef = useRef<HTMLInputElement>(null);

	return (
		<div
			className={props.className}
			style={props.style}
			onClick={() => {
				inputRef.current?.click();
			}}
		>
			{props.children}
			<input
				multiple
				className="hidden"
				type="file"
				ref={inputRef}
				onChange={(e) => {
					if (!e.target.files || e.target.files.length === 0) {
						return;
					}
					const files: File[] = [];
					for (const file of e.target.files) {
						files.push(file);
					}
					props.onFilesSelected?.(files);
				}}
			/>
		</div>
	);
}
