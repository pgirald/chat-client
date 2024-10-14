import {
	Attachment,
	AttachmentData,
	ContactStatusData,
	Settings,
	User,
} from "chat-api";
import { AttachmentUI, ChatUI, ContactUI, MessageUI } from "./Types";
import { EventHandler } from "../utils/Types";

export type Source = {
	authenticate: (email: string, password: string) => Promise<void>;
	getAllMyChats: () => Promise<ChatUI[]>;
	getMyChats: (
		page: number,
		count: number,
		chatName?: string
	) => Promise<ChatUI[]>;
	getContacts: (
		page: number,
		count: number,
		contactName?: string
	) => Promise<ContactUI[]>;
	getMyConfig: (canceler?: AbortController) => Promise<Settings | undefined>;
	sendMessage: (
		content: string,
		attachments: AttachmentUI[],
		chat: ChatUI
	) => Promise<MessageUI>;
	updateChat: (chat: ChatUI, canceler?: AbortController) => Promise<void>;
	createChat: (chat: ChatUI, canceler?: AbortController) => Promise<void>;
	user: ContactUI;
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
