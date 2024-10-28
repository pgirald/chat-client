import { Meta, StoryObj } from "@storybook/react/*";
import "../index.css";
import { globalContext } from "../tests/src/Context";
import { ChatMessageData, ChatSection } from "../components/ChatSection";
import { ChatUI } from "../Chore/Types";
import { useRef } from "react";
import { useChats } from "./src/UseChats";

const meta: Meta<typeof ChatSection> = {
	component: ChatSection,
	parameters: {
		docs: {
			source: { type: "code" },
		},
	},
};

export default meta;

export const Chatting: StoryObj<typeof ChatSection> = {
	args: {
		className: "h-[100vh] w-[100vw]",
	},

	decorators: [
		(Story, { args }) => {
			const [chats, addMessageTo] = useChats(globalContext.chats);

			return <Story args={args} />;
		},
	],
};
