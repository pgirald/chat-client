import { CSSProperties, ReactNode, useContext, useEffect, useRef } from "react";
import { userContext } from "../Global/User";
import { StyleSheet } from "../utils/Types";
import { MessageUI } from "../Chore/Types";
import { languageContext } from "../Global/Language";
import { fixedTheme } from "../Global/Theme";

export type MessagePanelProps = {
	messages: MessageUI[];
	className?: string;
};

export type MessageItemProps = {
	message: MessageUI;
	isFromUser: boolean;
};

export function MessagePanel(props: MessagePanelProps) {
	useEffect(() => {
		if (msgPanel.current) {
			msgPanel.current.scrollTop = msgPanel.current.scrollHeight;
		}
	}, [props.messages.length]);

	const user = useContext(userContext);
	const msgPanel = useRef<HTMLDivElement>(null);

	return (
		<div className={props.className} ref={msgPanel} style={styles.messagePanel}>
			{props.messages.map((message) => (
				<MessageItem
					key={message.id}
					message={message}
					isFromUser={message.sender.id === user.id}
				/>
			))}
		</div>
	);
}

export function MessageItem(props: MessageItemProps) {
	const language = useContext(languageContext);

	const style: CSSProperties = {
		backgroundColor: props.isFromUser
			? fixedTheme.logoOrange
			: fixedTheme.logoBlue,
		alignSelf: props.isFromUser ? "flex-start" : "flex-end",
	};

	let status: ReactNode;
	const receptionTime = props.message.receptionTime;
	switch (props.message.status) {
		case "Sent":
			status = (
				<span
					className={`font-roboto text-[8px] text-[${fixedTheme.elementGray}]`}
				>
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
				<button className={`font-roboto text-white bg-[${fixedTheme.red}]`}>
					{language.reSend}
				</button>
			);
			break;
		case "Sending":
			status = (
				<span
					className={`font-roboto text-[8px] text-[${fixedTheme.elementGray}]`}
				>
					{language.sending}
				</span>
			);
			break;
		// status = (
		// 	<ClipLoader
		// 		color={fixedTheme.elementGray}
		// 		size={8}
		// 		data-testid="clip-loader"
		// 	/>
		// );
	}

	return (
		<div>
			{status}
			<div style={{ ...styles.messageItem, ...style }}>
				{props.message.content}
			</div>
		</div>
	);
}

const styles: StyleSheet = {
	messagePanel: {
		flexDirection: "column",
		overflowY: "scroll",
	},
	messageItem: {
		fontSize: 12,
		fontFamily: "Roboto",
		color: fixedTheme.white,
		width: "fit-content",
		maxWidth: 245,
		borderRadius: 90,
		height: "fit-content",
		padding: "5px 15px 5px 15px",
		marginBottom: 10,
	},
};
