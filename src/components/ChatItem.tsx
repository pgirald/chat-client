import { ReactElement, useContext } from "react";
import { StyleSheet } from "../utils/Types";
import { StatusIcon } from "./StatusIcon";
import { Language, languageContext } from "../Global/Language";
import { chatLabel, subsConnected } from "./utils";
import { ChatUI } from "../Chore/Types";
import { userContext } from "../Global/User";

export type ChatItemProps = {
	onClick?: () => void;
	chat: ChatUI;
	className?: string;
};

export function ChatItem(props: ChatItemProps): ReactElement<ChatItemProps> {
	const user = useContext(userContext)!;
	const language = useContext(languageContext);
	return (
		<div className={props.className} onClick={(e) => props.onClick?.()}>
			<span style={styles.chat}>{chatLabel(props.chat, user, language)}</span>
			<StatusIcon isConnected={subsConnected(props.chat, user)} />
		</div>
	);
}

const styles: StyleSheet = {
	chat: {
		fontSize: 12,
		fontFamily: "Roboto",
		fontWeight: 700,
	},
};
