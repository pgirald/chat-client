import {
	ForwardedRef,
	forwardRef,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import { MessageData } from "./Chat";
import { Modal, ModalHandler } from "./Modal";
import { themeContext } from "../global/Theme";
import { AttachmentsDisplay, FileData } from "./AttachmentsDisplay";
import { IoMdRemoveCircle } from "react-icons/io";
import { FilePickerWrapper } from "./FilePickerWrapper";
import { RiAddBoxFill } from "react-icons/ri";
import { getFileExtension, truncateStr } from "../utils";
import { MessageInput } from "./MessagesInput";
import { PiPlusCircleFill } from "react-icons/pi";

export const AttachmentsModal = forwardRef(
	(
		{
			defaultValue,
			onAccept,
			files,
		}: {
			defaultValue?: string;
			onAccept?: (msg: MessageData) => void;
			files: File[];
		},
		ref: ForwardedRef<ModalHandler>
	) => {
		const msgRef = useRef<HTMLTextAreaElement>(null);
		const theme = useContext(themeContext);
		const [_files, setFiles] = useState<FileData[]>([]);

		useEffect(() => {
			setFiles(files2fileData(files));
		}, [files]);

		return (
			// <Modal
			// 	className="self-center h-fit w-fit items-center p-1 rounded-md border"
			// 	isOpen={show}
			// >
			// 	<CloseFrame className="space-y-2" onCloseRequested={onCloseRequested}>

			// 	</CloseFrame>
			// </Modal>
			<Modal
				ref={ref}
				closeFrameProps={{ wrapperClassName: "space-y-5" }}
			>
				<AttachmentsDisplay
					className="h-fit max-h-60 w-80 pr-5 overflow-y-scroll"
					files={_files}
					iconColor={theme.breaker}
					wraper={({ children, file }) => (
						<div className="flex-row spacex-x-2 cursor-pointer">
							<IoMdRemoveCircle
								className="self-center"
								color={theme.breaker}
								onClick={() => {
									const fileIdx = _files.indexOf(file);
									_files.splice(fileIdx, 1);
									setFiles([..._files]);
								}}
							/>
							{children}
						</div>
					)}
				/>
				<MessageInput
					className="w-full"
					onSendMessage={() => {
						onAccept?.({
							attachments: _files,
							content: msgRef.current?.value || "",
						});
					}}
					ref={msgRef}
					defaultValue={defaultValue}
					onFilesSelected={(files) => {
						setFiles([...files2fileData(files), ..._files]);
					}}
					filesIcon={PiPlusCircleFill}
				/>
			</Modal>
		);

		function files2fileData(files: File[]): FileData[] {
			return files.map((file) => ({
				name: truncateStr(file.name, 45),
				url: URL.createObjectURL(file),
				type: getFileExtension(file.name),
			}));
		}
	}
);
