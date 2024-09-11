import { Meta, StoryObj } from "@storybook/react/*";
import { MessageItem } from "../components/MessagePanel";
import { fakeViews } from "../tests/src/Mocks";

const meta: Meta<typeof MessageItem> = { component: MessageItem };

export default meta;

export const Sending: StoryObj<typeof MessageItem> = {
	args: { message: fakeViews[0].chats[0].messages[0], isFromUser: true },
};
