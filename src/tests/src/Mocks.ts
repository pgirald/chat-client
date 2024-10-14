import { Emitter, Source } from "../../Chore/Source";
import * as fs from "fs";
import { EventHandler, sleep } from "../../utils/General";
import {
	ChatUI,
	ContactUI,
	MessageUI,
	SettingsUI,
	UserUI,
} from "../../Chore/Types";
import { ContactStatusData } from "chat-api";
import { FindBy } from "@testing-library/react";
import { fromJSON } from "flatted";
import rawViews from "../fakeViews.json";
import { json } from "stream/consumers";
import { InvalidParamsError } from "../../utils/objectOps";
import { chatLabel } from "../../Chore/view";
import { globalContext } from "./Context";

export type FViews = {
	user: UserUI;
	settings?: SettingsUI;
	chats: ChatUI[];
	contacts: ContactUI[];
}[];

export const fakeViews = getFakeViews();

function getFakeViews(): FViews {
	const fakeViews: FViews = fromJSON(rawViews);
	fakeViews.forEach((fv) =>
		fv.chats.forEach((chat) => {
			chat.messages.forEach((message) => {
				message.receptionTime = new Date(message.receptionTime);
				message.status = "Sent";
			});
			chat.subs.forEach((sub) => (sub.connected = false));
		})
	);
	return fakeViews;
}

//Milliseconds
const sleepTime = 500;

export type MockSource = Source & {
	_authenticate: (email: string, password: string) => void;
};

export function MockServer(): Source {
	let consumer: ContactUI;
	let contacts: ContactUI[];
	let chats: ChatUI[];
	let settings: SettingsUI | undefined;
	let authenticated = false;
	return {
		_authenticate(email, password) {
			const userData = fakeViews.find((fv) => fv.user.email === email);
			if (!userData) {
				throw new InvalidParamsError("The given email is not registered");
			}
			consumer = {
				...userData.user,
				blocked: false,
				connected: false,
				muted: false,
			};
			settings = userData.settings;
			chats = userData.chats.sort((chat1, chat2) => chat1.id - chat2.id);
			contacts = userData.contacts;
			authenticated = true;
		},
		async authenticate(email, password): Promise<void> {
			await sleep(sleepTime);
			this._authenticate(email, password);
		},
		async getMyChats(page, count, chatName?): Promise<ChatUI[]> {
			await sleep(sleepTime);
			if (page < 0) {
				throw new InvalidParamsError("'page' parameter has an invalid value");
			}
			const start = page * count;
			const end = start + count;
			return deepCopy(
				chats
					.filter((chat) =>
						chatLabel(chat, globalContext.user, globalContext.language)
							.toLowerCase()
							.includes(chatName?.toLowerCase() || "")
					)
					.slice(start, end)
			);
		},
		async getContacts(page, count, username?): Promise<ContactUI[]> {
			await sleep(sleepTime);
			if (page < 0) {
				throw new InvalidParamsError("'page' parameter has an invalid value");
			}
			const start = page * count;
			const end = start + count;
			return deepCopy(
				contacts
					.filter((contact) =>
						contact.username
							.toLowerCase()
							.includes(username?.toLowerCase() || "")
					)
					.slice(start, end)
			);
		},
		async getMyConfig(canceler?): Promise<SettingsUI | undefined> {
			await sleep(sleepTime, canceler);
			if (canceler?.signal.aborted) {
				return;
			}
			return settings && deepCopy(settings);
		},
		async getAllMyChats() {
			await sleep(sleepTime);
			return deepCopy(chats);
		},
		async sendMessage(content, attachments, chat) {
			await sleep(sleepTime);
			const _chat = chats.find((_chat) => _chat.id === chat.id);
			if (!_chat) {
				throw Error("The specified chat is invalid");
			}
			const message: MessageUI = {
				id: (_chat.messages.at(-1)?.id || 0) + 1,
				attachments: attachments,
				content: content,
				receptionTime: new Date(Date.now()),
				sender: { ...consumer, blocked: false, muted: false },
				status: "Sent",
			};
			_chat.messages.push(message);
			return deepCopy(message);
		},
		async updateChat(chat, canceler?) {
			await sleep(sleepTime, canceler);
			if (canceler?.signal.aborted) {
				return;
			}
			const idx = chats.findIndex((_chat) => _chat.id === chat.id);
			if (idx === -1) {
				throw Error("A chat with the specified ID does not exist");
			}
			chats[idx] = { ...chats[idx], ...deepCopy(chat) };
			return deepCopy(chats[idx]);
		},
		async createChat(chat, canceler?) {
			await sleep(sleepTime, canceler);
			if (canceler?.signal.aborted) {
				return;
			}
			const newChat = deepCopy(chat);
			newChat.id = (chats.at(-1)?.id || 0) + 1;
			chats.unshift(newChat);
			return deepCopy(newChat);
		},
		get user() {
			return consumer;
		},
		emitter,
		get authenticated() {
			return authenticated;
		},
	} as MockSource;
}

const reviver = (key: any, value: any) => {
	// Check if the value is a string in ISO 8601 date format
	if (
		typeof value === "string" &&
		/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(value)
	) {
		return new Date(value); // Convert to Date object
	}
	return value; // Return other values unchanged
};

function deepCopy(obj: Object) {
	return JSON.parse(JSON.stringify(obj), reviver);
}

const emitter: Emitter = {
	connect: function (): void {},
	disconnect: function (): void {},
	onConnectionStatusChanged: EventHandler(),
	onContactStatusChaged: EventHandler(),
	onMessageReceived: EventHandler(),
	onError: EventHandler(),
};
