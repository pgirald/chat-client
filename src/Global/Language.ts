import { createContext } from "react";

export type Language = {
	reSend: string;
	dateFormat: string;
	me: string;
	group: string;
	sending: string;
};

export const spanish: Language = {
	reSend: "Reenviar",
	dateFormat: "es",
	me: "Yo",
	group: "Grupo",
	sending: "Enviando",
};

export const english: Language = {
	reSend: "Re-send",
	dateFormat: "en",
	me: "me",
	group: "Group",
	sending: "Sending",
};

export const languageContext = createContext<Language>(english);
