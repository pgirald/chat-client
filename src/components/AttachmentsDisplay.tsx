import { IconType } from "react-icons";
import { PiFileImageFill } from "react-icons/pi";
import { PiFileVideoFill } from "react-icons/pi";
import { PiFilePdfFill } from "react-icons/pi";
import { PiFileFill } from "react-icons/pi";
import { E } from "../utils";
import { FC, ReactElement, ReactNode } from "react";

const FileTypes: { [idx: string]: IconType } = {
	jpg: PiFileImageFill,
	jpeg: PiFileImageFill,
	png: PiFileImageFill,
	gif: PiFileImageFill,
	bmp: PiFileImageFill,
	svg: PiFileImageFill,
	webp: PiFileImageFill,
	mp4: PiFileVideoFill,
	mov: PiFileVideoFill,
	avi: PiFileVideoFill,
	mkv: PiFileVideoFill,
	webm: PiFileVideoFill,
	pdf: PiFilePdfFill,
	unknown: PiFileFill,
};

export type FileData = { type?: string; url: string; name: string };

export type AttachmentsDisplayProps = {
	className?: string;
	files: FileData[];
	iconSize?: number;
	iconColor?: string;
	wraper?: ({
		children,
		file,
	}: {
		children: ReactNode;
		file: FileData;
	}) => ReactElement;
};

export function AttachmentsDisplay(props: AttachmentsDisplayProps) {
	let FileIcon: IconType;
	let FileNode: ReactNode;
	let type: string;

	return (
		<div className={`${E(props.className)} space-y-5`}>
			{props.files.map((file) => {
				type = file.type || "unknown";
				FileIcon = FileTypes[type.toLowerCase()] || FileTypes.unknown;
				FileNode = (
					<a
						key={props.wraper ? undefined : file.url}
						className="flex space-x-1"
						target="_blank"
						href={file.url}
					>
						<FileIcon
							className="p-0"
							color={props.iconColor}
							size={props.iconSize || 30}
						/>
						<span className="self-center font-Roboto text-sm">{file.name}</span>
					</a>
				);
				return props.wraper ? (
					<props.wraper key={file.url} file={file}>
						{FileNode}
					</props.wraper>
				) : (
					FileNode
				);
			})}
		</div>
	);
}