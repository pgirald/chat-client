import { createContext, ReactNode, useContext, useState } from "react";
import { ChatUI } from "../Chore/Types";

const chatsContext = createContext<[ChatUI[], (chats: ChatUI[]) => void]>([
	[],
	() => {},
]);

export type ChatsProviderProps = {
	children: ReactNode;
};

export function ChatsProvider(props: ChatsProviderProps) {
	const [chats, setChats] = useState<ChatUI[]>([]);

	return (
		<chatsContext.Provider value={[chats, setChats]}>
			{props.children}
		</chatsContext.Provider>
	);
}

export function useChats() {
	return useContext(chatsContext);
}
