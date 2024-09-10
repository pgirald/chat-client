import { render, screen } from "@testing-library/react";
import {
	MessagePanel,
	MessagePanelProps,
} from "../../components/MessagePanel";
import { english, languageContext } from "../../Global/Language";
import { userContext } from "../../Global/User";
import { fakeViews } from "../src/Mocks.js";
import { ChatUI, MessageUI, UserUI } from "../../Chore/Types";
import "@testing-library/jest-dom";

const renderMessagePanel = (props: MessagePanelProps & { user: UserUI }) => {
	return render(
		<userContext.Provider value={props.user}>
			<languageContext.Provider value={english}>
				<MessagePanel
					messages={props.messages}
					className={props.className || ""}
				/>
			</languageContext.Provider>
		</userContext.Provider>
	);
};

const mockChats = [
	{
		id: 1,
		messages: [
			{
				id: "1",
				sender: { id: "user1" },
				content: "Hello there!",
				status: "Sent",
				receptionTime: new Date(),
			},
		],
	},
	{
		id: 2,
		messages: [
			{
				id: "2",
				sender: { id: "user2" },
				content: "Hi!",
				status: "Sending",
				receptionTime: new Date(),
			},
			{
				id: "3",
				sender: { id: "user2" },
				content: "Message not sent",
				status: "Not sent",
				receptionTime: new Date(),
			},
		],
	},
] as any as ChatUI[];

describe("MessagePanel", () => {
	it.each<{ chat?: ChatUI; changes?: (chat?: ChatUI) => MessageUI[] }>([
		{
			chat: mockChats[0],
		},
		{
			chat: mockChats[1],
		},
		{},
	])("renders messages correctly", ({ chat, changes }) => {
		const user = fakeViews[0].user;
		const language = english;
		const chats = fakeViews.find((fv) => fv.user.id === user.id)!.chats;
		const selectedChat =
			chats.length === 0
				? undefined
				: chats[Math.floor(Math.random() * chats.length)];

		let messages = selectedChat ? selectedChat.messages : [];

		if (changes) {
			messages = changes(selectedChat);
		}

		renderMessagePanel({ messages: messages, user: user, className: "" });

		messages.forEach((message) => {
			expect(screen.getByText(message.content)).toBeInTheDocument();
			if (message.status === "Sent") {
				const dateStr = message.receptionTime.toLocaleDateString(
					language.dateFormat,
					{
						day: "2-digit",
						month: "short",
						year: "numeric",
						hour: "2-digit",
						minute: "2-digit",
					}
				);
				expect(screen.getByText(dateStr)).toBeInTheDocument();
			} else if (message.status === "Not sent") {
				expect(
					screen.getByRole("button", { name: /Resend/i })
				).toBeInTheDocument();
			} else if (message.status === "Sending") {
				expect(screen.getByText("Sending...")).toBeInTheDocument();
			}
		});
	});
});
