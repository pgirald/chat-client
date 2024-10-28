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
	) => Promise<[ChatUI[], boolean]>;
	getContacts: (
		page: number,
		count: number,
		contactName?: string
	) => Promise<[ContactUI[], boolean]>;
	getMyConfig: (canceler?: AbortController) => Promise<Settings | undefined>;
	sendMessage: (
		content: string,
		attachments: AttachmentUI[],
		chat: ChatUI
	) => Promise<MessageUI>;
	updateChat: (
		chat: ChatUI,
		canceler?: AbortController
	) => Promise<ChatUI | undefined>;
	createChat: (
		chat: ChatUI,
		canceler?: AbortController
	) => Promise<ChatUI | undefined>;
	updateMyInfo: (
		newInfo: ContactUI,
		canceler?: AbortController
	) => Promise<ContactUI | undefined>;
	user: ContactUI;
	authenticated: boolean;
	emitter: Emitter;
};

export type Emitter = {
	connect: () => void;
	disconnect: () => void;
	onConnectionStatusChanged: EventHandler<[boolean], (online: boolean) => void>;
	onContactStatusChaged: EventHandler<
		[ContactStatusData],
		(contactStatus: ContactStatusData) => void
	>;
	onMessageReceived: EventHandler<
		[MessageUI, number],
		(message: MessageUI, chatId: number) => void
	>;
	onError: EventHandler<[Error], (error: Error) => void>;
};

export function Client(source: Source, user: User) {}

export type Client = ReturnType<typeof Client>;
