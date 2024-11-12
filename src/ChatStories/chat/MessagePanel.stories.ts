import { Meta, StoryObj } from "@storybook/react/*";
import "../index.css";
import { globalContext } from "../../tests/src/Context";
import { MessagePanel } from "../../components/chat/private/MessagePanel";

const meta: Meta<typeof MessagePanel> = { component: MessagePanel };

export default meta;

export const ShowingMessages: StoryObj<typeof MessagePanel> = {
	args: {
		className: "border-black w-full h-[100vh]",
	},
};
