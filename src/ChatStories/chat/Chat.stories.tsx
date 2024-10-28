import { Meta, StoryObj } from "@storybook/react/*";
import "../index.css";
import { globalContext } from "../../tests/src/Context";
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
							className: "h-[100vh] w-[40%] ",
						}}
					/>
				</div>
			);
		},
	],
};
