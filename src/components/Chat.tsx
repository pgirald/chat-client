import {
	CSSProperties,
	ForwardedRef,
	forwardRef,
	RefObject,
	useContext,
	useState,
} from "react";
import { StatusIcon } from "./StatusIcon";
import { ChatItemProps as ChatItemProps } from "./ChatItem";
import { MessagePanel, MessagePanelProps } from "./MessagePanel";
import { E } from "../utils/General";
import { chatLabel, subsConnected } from "./utils";
import { languageContext } from "../Global/Language";
import { ChatUI } from "../Chore/Types";
import { userContext } from "../Global/User";
/*
onMessage(content) {
    if (this.selectedUser) {
      socket.emit("private message", {
        content,
        to: this.selectedUser.userID,
      });
      this.selectedUser.messages.push({
        content,
        fromSelf: true,
      });
    }
  },
*/

export type ChatProps = {
	chat: ChatUI;
	onMessage?: (content: string) => void;
	className?: string;
};

export type StatusCardProps = {
	isConnected: boolean;
	label: string;
	className?: string;
};

export const Chat = forwardRef(
	(
		{ chat, onMessage, className }: ChatProps,
		ref?: ForwardedRef<HTMLDivElement>
	) => {
		const user = useContext(userContext)!;
		const language = useContext(languageContext);
		return (
			<div ref={ref} className={className}>
				<StatusCard
					className="pl-2 flex-[1]"
					label={chatLabel(chat, user, language)}
					isConnected={subsConnected(chat, user)}
				/>
				<MessagePanel
					className="flex-[7] border-[1px] border-slate-600 w-full"
					messages={chat.messages}
				/>
				<InputBox
					className="flex-[4] w-[50%] self-center"
					onMessageSent={onMessage}
				/>
			</div>
		);
	}
);

export function StatusCard(props: StatusCardProps) {
	return (
		<div className={`${E(props.className)} flex-row space-x-1 items-center`}>
			<StatusIcon isConnected={props.isConnected} showLabel={false} />
			<span>{props.label}</span>
		</div>
	);
}

function Separator() {
	return <div className="w-full h-[0.5px] bg-slate-500" />;
}

function InputBox({
	onMessageSent,
	className,
}: {
	onMessageSent?: (content: string) => void;
	className?: string;
}) {
	const margin = 7;
	const [msg, setMsg] = useState("");
	return (
		<div className={`${className} space-y-1`}>
			<textarea
				className={`w-full h-full overflow-y-auto rounded-lg border-gray-600 border-[1px] mx-${margin}`}
				value={msg}
				onChange={(e) => setMsg(e.target.value)}
			/>
			<button
				className={`content-center bg-teal-600 font-roboto
				font-bold text-white h-fit w-full rounded-md mx-${margin}`}
				onClick={() => {
					setMsg("");
					msg && onMessageSent?.(msg);
				}}
			>
				Send
			</button>
		</div>
	);
}
