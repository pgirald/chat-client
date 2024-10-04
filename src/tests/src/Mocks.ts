import { Emitter, Source } from "../../Chore/Source";
import * as fs from "fs";
import { EventHandler, InvalidParamsError, sleep } from "../../utils";
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

export type FViews = {
	user: UserUI;
	settings?: SettingsUI;
	chats: ChatUI[];
	allChats: ChatUI[];
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

export function MockServer(): Source {
	let consumer: UserUI;
	let chats: ChatUI[];
	let settings: SettingsUI | undefined;
	let authenticated = false;
	return {
		async authenticate(email: string, password: string): Promise<void> {
			await sleep(sleepTime);
			const userData = fakeViews.find((fv) => fv.user.email === email);
			if (!userData) {
				throw new InvalidParamsError("The given email is not registered");
			}
			consumer = userData.user;
			settings = userData.settings;
			chats = userData.chats.sort((chat1, chat2) => chat1.id - chat2.id);
			authenticated = true;
		},
		async getMyChats(page: number, count: number): Promise<ChatUI[]> {
			await sleep(sleepTime);
			if (!consumer) {
				throw Error(
					"You must be authenticated in order to consume this service"
				);
			}
			if (page < 0) {
				throw new InvalidParamsError("'page' parameter has an invalid value");
			}
			const start = page * count;
			const end = start + count;
			return deepCopy(chats.slice(start, end));
		},
		async getMyConfig(): Promise<SettingsUI | undefined> {
			await sleep(sleepTime);
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
				id: _chat.messages.at(-1)?.id || 0 + 1,
				attachments: attachments,
				content: content,
				receptionTime: new Date(Date.now()),
				sender: { ...consumer, blocked: false, muted: false },
				status: "Sent",
			};
			_chat.messages.push(message);
			return deepCopy(message);
		},
		emitter,
		get authenticated() {
			return authenticated;
		},
	};
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
