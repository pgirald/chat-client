import {
	CSSProperties,
	ForwardedRef,
	forwardRef,
	ReactElement,
	useContext,
} from "react";
import { StyleSheet } from "../utils/Types";
import { Language, languageContext } from "../global/Language";
import { chatImg, chatLabel, subsConnected } from "./utils";
import { ChatUI } from "../Chore/Types";
import { userContext } from "../global/User";
import { fixedTheme, themeContext } from "../global/Theme";
import { E, truncateStr } from "../utils";
import { Label } from "./Styling";
import { ProfileItem } from "./ProfileItem";
import { env } from "process";
import profileImage from "../assets/profile.png";

export type ChatsListProps = {
	children: ChatUI[];
	className?: string;
	onChatSelected?: (chat: ChatUI, idx: number) => void;
	style?: CSSProperties;
	selected?: number;
};

export const ChatsList = forwardRef<HTMLDivElement, ChatsListProps>(
	(props: ChatsListProps, ref?: ForwardedRef<HTMLDivElement>) => {
		const user = useContext(userContext)!;
		const language = useContext(languageContext);

		return (
			<div
				className={`${E(props.className)} p-0 m-0 space-y-1`}
				style={props.style}
				ref={ref}
			>
				{props.children.map((chat, idx) => (
					<ProfileItem
						key={chat.id}
						name={chatLabel(chat, user, language)}
						img={chatImg(chat, user)}
						description={truncateStr(chat.messages.at(-1)?.content || "")}
						onClick={() => {
							props.onChatSelected?.(chat, idx);
						}}
						className="w-full p-1"
						style={{
							backgroundColor:
								idx === props.selected ? fixedTheme.selectedItem : undefined,
						}}
						font={{ color: idx === props.selected ? "white" : undefined }}
					/>
				))}
			</div>
		);
	}
);
