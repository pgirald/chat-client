import { Meta, StoryObj } from "@storybook/react/*";
import "../index.css";
import { globalContext } from "../../tests/src/Context";
import { useContext, useEffect, useRef, useState } from "react";
import { MessageUI } from "../../Chore/Types";
import { useChats } from "../src/UseChats";
import { Chat } from "../../components/chat/Chat";
import { useUser } from "../../global/User";

const meta: Meta<typeof Chat> = { component: Chat };

export default meta;

export const Sending: StoryObj<typeof Chat> = {
	decorators: [
		(Story) => {
			const [chats, addMessageTo] = useChats(globalContext.chats);

			const user = useUser();
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
