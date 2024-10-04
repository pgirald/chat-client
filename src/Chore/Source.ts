import {
	Attachment,
	AttachmentData,
	ContactStatusData,
	Settings,
	User,
} from "chat-api";
import { EventHandler } from "../utils";
import { AttachmentUI, ChatUI, MessageUI } from "./Types";

export type Source = {
	authenticate: (email: string, password: string) => Promise<void>;
	getAllMyChats: () => Promise<ChatUI[]>;
	getMyChats: (page: number, count: number) => Promise<ChatUI[]>;
	getMyConfig: () => Promise<Settings | undefined>;
	sendMessage: (
		content: string,
		attachments: AttachmentUI[],
		chat: ChatUI
	) => Promise<MessageUI>;
	authenticated: boolean;
	emitter: Emitter;
};

export type Emitter = {
	connect: () => void;
	disconnect: () => void;
	onConnectionStatusChanged: EventHandler<(online: boolean) => void>;
	onContactStatusChaged: EventHandler<
		(contactStatus: ContactStatusData) => void
	>;
	onMessageReceived: EventHandler<(message: MessageUI, chatId: number) => void>;
	onError: EventHandler<(error: Error) => void>;
};

export function Client(source: Source, user: User) {}

export type Client = ReturnType<typeof Client>;
