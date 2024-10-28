import { Meta, StoryObj } from "@storybook/react/*";
import "../index.css";
import { ChatUI } from "../../Chore/Types";
import { chatLabel } from "../../Chore/view";
import { globalContext } from "../../tests/src/Context";
import { ChatsList } from "../../components/connections/ChatsList";

const meta: Meta<typeof ChatsList> = {
	component: ChatsList,
	parameters: {
		docs: {
			source: { type: "code" },
		},
	},
};

export default meta;

export const Sending: StoryObj<typeof ChatsList> = {
	args: {
		chats: globalContext.chats,
		onChatSelected: printSelected,
		className: "w-[220px]",
	},
};

function printSelected(chat: ChatUI, idx: number) {
	alert(
		`Chat ${idx}("${chatLabel(chat, globalContext.user, globalContext.language)}") was selected`
	);
}
