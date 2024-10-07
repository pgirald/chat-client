import {
	ForwardedRef,
	forwardRef,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import { MessageData } from "../Chat";
import { RiAddBoxFill } from "react-icons/ri";
import { PiPlusCircleFill } from "react-icons/pi";
import { BsDashLg, BsPlus } from "react-icons/bs";
import { BsDash } from "react-icons/bs";
import { Modal, ModalHandler } from "../../reusables/Modal";
import { fixedTheme, themeContext } from "../../../global/Theme";
import { AttachmentsDisplay, FileData } from "./AttachmentsDisplay";
import { getFileExtension, truncateStr } from "../../../utils/StringOps";
import { MessageInput } from "./MessagesInput";

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

		const iconsSize = 24;

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
			<Modal ref={ref} closeFrameProps={{ wrapperClassName: "space-y-5 p-2" }}>
				<AttachmentsDisplay
					className="h-fit max-h-60 w-[45ch] pr-5 overflow-y-scroll"
					maxCharacters={30}
					style={{ color: theme.content }}
					files={_files}
					iconColor={theme.breaker}
					wraper={({ children, file }) => (
						<div className="flex-row spacex-x-2 cursor-pointer">
							<BsDashLg
								className="icon"
								style={{ alignSelf: "center", backgroundColor: fixedTheme.red }}
								color="white"
								onClick={() => {
									const fileIdx = _files.indexOf(file);
									_files.splice(fileIdx, 1);
									setFiles([..._files]);
								}}
								strokeWidth={5}
							/>
							{children}
						</div>
					)}
				/>
				<MessageInput
					className="w-full h-fit"
					onSendMessage={() => {
						onAccept?.({
							attachments: _files,
							content: msgRef.current?.value || "",
						});
					}}
					ref={msgRef}
					defaultValue={defaultValue}
					iconsSize={iconsSize}
					onFilesSelected={(files) => {
						setFiles([...files2fileData(files), ..._files]);
					}}
					filesIcon={
						<BsPlus
							className="icon"
							style={{
								backgroundColor: theme.breaker,
							}}
							size={iconsSize}
							strokeWidth="0.5px"
							color="white"
						/>
					}
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
