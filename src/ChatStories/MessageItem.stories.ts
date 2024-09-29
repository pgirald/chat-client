import { Meta, StoryObj } from "@storybook/react/*";
import { MessageItem } from "../components/MessagePanel";
import { fakeViews } from "../tests/src/Mocks";
import "../index.css";
import { globalContext } from "../tests/src/Context";

const chat = globalContext.chats[0];

const meta: Meta<typeof MessageItem> = { component: MessageItem };

export default meta;

export const Sending: StoryObj<typeof MessageItem> = {
	args: { message: globalContext.chats[0].messages[0], isFromUser: true },
};
