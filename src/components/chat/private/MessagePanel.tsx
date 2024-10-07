import {
	CSSProperties,
	ReactNode,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import { userContext } from "../../../global/User";
import { StyleSheet } from "../../../utils/Types";
import { MessageUI } from "../../../Chore/Types";
import { languageContext } from "../../../global/Language";
import { fixedTheme, themeContext } from "../../../global/Theme";
import { IoIosArrowDown } from "react-icons/io";
import { AttachmentsDisplay } from "./AttachmentsDisplay";
import { AppButton } from "../../app_style/AppButton";
import { getFileExtension } from "../../../utils/StringOps";

export type MessagePanelProps = {
	messages: MessageUI[];
	className?: string;
	style?: CSSProperties;
};

export function MessagePanel(props: MessagePanelProps) {
	const panelRef = useRef<HTMLDivElement>(null);
	const msgsCountRef = useRef(props.messages.length);
	const wasAtBottomRef = useRef(false);

	const [newMsgs, setNewMsgs] = useState(false);

	const user = useContext(userContext);
	const language = useContext(languageContext);

	useEffect(() => {
		scrollToBottom();
	}, [props.messages]);
	
	useEffect(() => {
		// if (props.messages.length > msgsCountRef.current) {
		// 	setNewMsgs(
		// 		props.messages
		// 			.slice(msgsCountRef.current)
		// 			.some((msg) => msg.sender.id !== user.id)
		// 	);
		// }
		const newMsgs = props.messages.length > msgsCountRef.current;
		if (newMsgs && wasAtBottomRef.current) {
			scrollToBottom();
		} else {
			setNewMsgs(newMsgs);
		}
		msgsCountRef.current = props.messages.length;
	}, [props.messages.length]);

	return (
		<div
			className={props.className}
			style={{
				...props.style,
				position: "relative",
			}}
		>
			<div
				className="overflow-y-scroll w-full h-full px-10"
				ref={panelRef}
				onScroll={(e) => {
					if (scrolledToBottom(e.currentTarget)) {
						wasAtBottomRef.current = true;
						setNewMsgs(false);
					} else if (wasAtBottomRef.current) {
						wasAtBottomRef.current = false;
					}
				}}
			>
				{props.messages.map((message) => (
					<MessageItem
						key={message.id}
						message={message}
						isFromUser={message.sender.id === user.id}
					/>
				))}
			</div>
			{newMsgs && (
				<div
					className="self-center absolute bottom-1 rounded-full cursor-pointer p-1"
					style={{ backgroundColor: fixedTheme.green }}
					onClick={scrollToBottom}
				>
					<IoIosArrowDown color={fixedTheme.white} size={25} />
				</div>
			)}
		</div>
	);

	function scrollToBottom() {
		if (panelRef.current) {
			panelRef.current.scrollTop = panelRef.current.scrollHeight;
		}
	}

	function scrolledToBottom(div: HTMLDivElement) {
		return Math.abs(div.scrollHeight - (div.scrollTop + div.clientHeight)) <= 1;
		//return div.scrollTop + div.clientHeight === div.scrollHeight;
	}
}

export type MessageItemProps = {
	message: MessageUI;
	isFromUser: boolean;
};

export function MessageItem(props: MessageItemProps) {
	const language = useContext(languageContext);
	const bordersWidth = 20;
	const theme = useContext(themeContext);

	const labelsClass = "font-Roboto text-xs";

	const msgColor = props.isFromUser
		? fixedTheme.logoOrange
		: fixedTheme.logoBlue;

	const msgAlignment = props.isFromUser ? "self-start" : "self-end";

	let status: ReactNode;
	const receptionTime = props.message.receptionTime;
	switch (props.message.status) {
		case "Sent":
			status = (
				<span className={labelsClass} style={{ color: theme.content }}>
					{receptionTime.toLocaleDateString(language.dateFormat, {
						day: "2-digit",
						month: "short",
						year: "numeric",
						hour: "2-digit",
						minute: "2-digit",
					})}
				</span>
			);
			break;

		case "Not sent":
			status = (
				<AppButton
					content={language.reSend}
					className="mb-3"
					style={{ backgroundColor: fixedTheme.red }}
				/>
			);
			break;
		case "Sending":
			status = (
				<span className={labelsClass} style={{ color: theme.content }}>
					{language.sending}
				</span>
			);
			break;
	}

	return (
		<div data-testid="MessageItem" className={`${msgAlignment}  mb-3`}>
			<div className="flex-row">
				<div style={{ width: bordersWidth }} />
				{status}
			</div>
			<div className={`items-stretch flex-row`}>
				<div
					style={{
						backgroundColor: msgColor, //style.backgroundColor,
						width: bordersWidth,
						borderRadius: "100px 0 0 100px",
					}}
				/>
				<div
					//marginBottom: 10,
					className="space-y-2 text-sm max-w-96 font-Roboto text-white w-fit h-fit py-1"
					style={{ backgroundColor: msgColor }}
				>
					<span>{props.message.content}</span>
					{props.message.attachments.length > 0 && (
						<AttachmentsDisplay
							className="space-y-0 w-fit h-fit"
							files={props.message.attachments.map((att) => ({
								...att,
								type: getFileExtension(att.name),
							}))}
						/>
					)}
					<div
						className="self-end rounded-full px-2 text-xs"
						style={{ backgroundColor: theme.breaker }}
					>
						{props.isFromUser ? language.you : props.message.sender.username}
					</div>
				</div>
				<div
					style={{
						backgroundColor: msgColor,
						width: bordersWidth,
						borderRadius: "0 100px 100px 0",
					}}
				/>
			</div>
		</div>
	);
}
