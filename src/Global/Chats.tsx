import { ChatUI, ContactUI } from "../Chore/Types";
import { create } from "zustand";

type State = {
	requestedChats: ChatUI[];
	selectedChat?: ChatUI;
};

type Action = {
	replaceChats: (chats: ChatUI[]) => void;
	appendChats: (chats: ChatUI[]) => void;
	setSelectedChat: (selected: number) => void;
	updateSelectedChat: (newChat: ChatUI) => void;
	updateContactDependents: (newOwner: ContactUI) => void;
	updateChats: (newChats: ChatUI[]) => void;
};

// Create your store, which includes both state and (optionally) actions
export const useChatsStore = create<State & Action>((set) => {
	return {
		requestedChats: [],
		replaceChats: (chats) =>
			set(() => {
				return { requestedChats: chats };
			}),
		appendChats: (chats) =>
			set((state) => ({ requestedChats: [...state.requestedChats, ...chats] })),
		setSelectedChat: (selected) =>
			set((state) => {
				const chat = state.requestedChats.find((chat) => chat.id === selected);
				if (!chat) {
					throw Error("There is not an avialable chat with the specified id");
				}
				return { selectedChat: { ...chat } };
			}),
		updateSelectedChat: (newChat) =>
			set((state) => {
				if (!state.selectedChat) {
					throw Error("A chat has not been selected");
				}

				if (state.selectedChat.id !== newChat.id) {
					throw Error(
						"The given chat's ID is different from the selected chat's ID"
					);
				}

				let requestedChats = state.requestedChats;
				const idx = state.requestedChats.findIndex(
					(chat) => chat.id === newChat.id
				);
				if (idx !== -1) {
					requestedChats[idx] = newChat;
					requestedChats = [...requestedChats];
				}
				return { selectedChat: { ...newChat }, requestedChats: requestedChats };
			}),

		updateContactDependents: (newContact) =>
			set((state) => {
				const selectedChat = state.selectedChat
					? { ...state.selectedChat }
					: undefined;
				let updatedChats = [...state.requestedChats];
				for (const chat of [
					...updatedChats,
					...(selectedChat ? [selectedChat] : []),
				]) {
					if (chat.owner.id === newContact.id) {
						chat.owner = newContact;
					}
					const subIdx = chat.subs.findIndex((sub) => sub.id === newContact.id);
					if (subIdx !== -1) {
						chat.subs[subIdx] = newContact;
					}
				}
				return {
					requestedChats: updatedChats,
					selectedChat: selectedChat,
				};
			}),

		updateChats: (newChats) =>
			set((state) => {
				let chatIdx;
				let selectedChat = state.selectedChat;
				for (const newChat of newChats) {
					chatIdx = state.requestedChats.findIndex(
						(chat) => chat.id === newChat.id
					);
					if (chatIdx !== -1) {
						state.requestedChats[chatIdx] = newChat;
					} else if (selectedChat && newChat.id === selectedChat.id) {
						selectedChat = { ...newChat };
					} else {
						throw Error(`A chat with ID ${newChat.id} was not found`);
					}
				}
				return {
					requestedChats: [...state.requestedChats],
					selectedChat: selectedChat,
				};
			}),
	};
});
