import { Meta, StoryObj } from "@storybook/react/*";
import "../index.css";
import { globalContext } from "../tests/src/Context";
import { useContext, useRef, useState } from "react";
import { languageContext } from "../global/Language";
import { AttachmentsDisplay } from "../components/AttachmentsDisplay";
import { getFileExtension } from "../utils";
import { FilePickerWrapper } from "../components/FilePickerWrapper";

const meta: Meta = {
	component: (props: { className?: string }) => {
		const [files, setFiles] = useState<File[]>([]);
		const language = useContext(languageContext);
		const inputRef = useRef<HTMLInputElement>(null);

		return (
			<div>
				<AttachmentsDisplay
					className={props.className}
					files={files.map((file) => ({
						type: getFileExtension(file.name),
						url: URL.createObjectURL(file),
						name: file.name,
					}))}
				/>
				<FilePickerWrapper
					onFilesSelected={(_files) => {
						setFiles([...files, ..._files]);
					}}
				>
					<button
						className="p-1 size-fit rounded-full text-white bg-red-400"
						onClick={() => {
							inputRef.current?.click();
						}}
					>
						Files
					</button>
				</FilePickerWrapper>
			</div>
		);
	},
};

export default meta;

export const Sending: StoryObj = { args: { className: "h-100, w-100" } };
