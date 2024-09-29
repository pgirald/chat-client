import { Meta, StoryObj } from "@storybook/react/*";
import "../index.css";
import { globalContext } from "../tests/src/Context";
import { Chat, MessageData } from "../components/Chat";
import { useContext, useEffect, useRef, useState } from "react";
import { userContext } from "../global/User";
import { MessageUI } from "../Chore/Types";
import { useChats } from "./UseChats";

const meta: Meta<typeof Chat> = { component: Chat };

export default meta;

export const Sending: StoryObj<typeof Chat> = {
	decorators: [
		(Story) => {
			const [chats, addMessageTo] = useChats(globalContext.chats);

			const user = useContext(userContext);
			return (
				<div>
					<Story
						args={{
							chat: chats?.[0],
							onMessage: (msg) => addMessageTo(0, msg),
							className: "h-[100vh] w-[40%] ",
						}}
					/>
				</div>
			);
		},
	],
};
