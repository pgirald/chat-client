import { Meta, StoryObj } from "@storybook/react/*";
import "../index.css";
import { globalContext } from "../tests/src/Context";
import { ProfileItem as ChatItem } from "../components/ProfileItem";
import { chatImg, chatLabel } from "../components/utils";
import { truncateStr } from "../utils";

const chat = globalContext.chats[0];

const meta: Meta<typeof ChatItem> = { component: ChatItem };

export default meta;

export const Sending: StoryObj<typeof ChatItem> = {
	args: {
		name: chatLabel(chat, globalContext.user, globalContext.language),
		img: chatImg(chat, globalContext.user),
		description: truncateStr(chat.messages.at(-1)?.content || ""),
		onClick: notifyClick,
		className: "w-[200px]",
	},
};

function notifyClick() {
	alert("The chat item was clicked");
}
