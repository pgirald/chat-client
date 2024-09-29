import { Meta, StoryObj } from "@storybook/react/*";
import { MessagePanel } from "../components/MessagePanel";
import "../index.css";
import { globalContext } from "../tests/src/Context";

const meta: Meta<typeof MessagePanel> = { component: MessagePanel };

export default meta;

export const ShowingMessages: StoryObj<typeof MessagePanel> = {
	args: {
		messages: globalContext.chats[0].messages,
		className: "border-black w-full h-[100vh]",
	},
};
