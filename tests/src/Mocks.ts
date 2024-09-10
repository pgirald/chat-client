import { Emitter, Source } from "../../src/Chore/Source";
import * as fs from "fs";
import { EventHandler, InvalidParamsError, sleep } from "../../src/utils";
import {
	ChatUI,
	ContactUI,
	MessageUI,
	SettingsUI,
	UserUI,
} from "../../src/Chore/Types";
import { ContactStatusData } from "chat-api";
import { FindBy } from "@testing-library/react";
import { parse } from "flatted";

export type FViews = { user: UserUI; settings?: SettingsUI; chats: ChatUI[] }[];

export const fakeViews = getFakeViews();

function getFakeViews(): FViews {
	const fakeViews: FViews = parse(
		fs.readFileSync("tests/FakeViews.json").toString()
	);
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
			return chats.slice(start, end);
		},
		async getMyConfig(): Promise<SettingsUI | undefined> {
			await sleep(sleepTime);
			return settings;
		},
		async getAllMyChats() {
			await sleep(sleepTime);
			return chats;
		},
		async sendMessage(content, attachments, chat) {
			await sleep(sleepTime);
			const message: MessageUI = {
				id: chat.messages[-1].id + 1,
				attachments: attachments.map((attachment) => ({
					name: attachment.name,
					url: attachment.name,
				})),
				content: content,
				receptionTime: new Date(Date.now()),
				sender: { ...consumer, blocked: false, muted: false },
				status: "Sending",
			};
			chat.messages.push(message);
			return message;
		},
		emitter,
	};
}

const emitter: Emitter = {
	connect: function (): void {},
	disconnect: function (): void {},
	onConnectionStatusChanged: EventHandler(),
	onContactStatusChaged: EventHandler(),
	onMessageReceived: EventHandler(),
	onError: EventHandler(),
};
