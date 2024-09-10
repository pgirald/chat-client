import {
	Contact as _Contact,
	Chat as _Chat,
	Message as _Message,
} from "chat-api";
import { Replace } from "../utils/Types";

export type ContactUI = _Contact & {
	connected: boolean;
};

export type MessageStatus = "Sent" | "Sending" | "Not sent";

export type MessageUI = _Message & { status: MessageStatus };

type _ChatUI = Replace<_Chat, "subs", ContactUI[]>;

export type ChatUI = Replace<_ChatUI, "messages", MessageUI[]>;

export {
	type Role as RoleUI,
	type User as UserUI,
	type Ringtone as RingtoneUI,
	type Attachment as AttachmentUI,
	type Settings as SettingsUI,
} from "chat-api";
