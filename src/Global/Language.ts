import { createContext } from "react";

export type Language = {
	reSend: string;
	dateFormat: string;
	me: string;
	group: string;
	sending: string;
	accept: string;
	locale: string;
	newMsgs: string;
	messages: string;
	members: string;
	block: string;
	mute: string;
	fullName: string;
	username: string;
	email: string;
	phone: string;
	notSpecified: string;
	editing: string;
	notName: string;
	chat: string;
	owner: string;
	discard: string;
	confirm: string;
	newChat: string;
	removeOwnerWarning: string;
};

export const spanish: Language = {
	reSend: "Reenviar",
	dateFormat: "es",
	me: "Yo",
	group: "Grupo",
	sending: "Enviando...",
	accept: "Aceptar",
	locale: "es",
	newMsgs: "Nuevos",
	messages: "Mensajes",
	members: "Miembros",
	block: "Bloquear",
	mute: "Mutear",
	fullName: "Full name",
	username: "Username",
	email: "Email",
	phone: "Phone",
	notSpecified: "<Not specified>",
	editing: "Editando",
	notName: "<Sin nombre>",
	chat: "Chat",
	owner: "Dueño",
	discard: "Descartar",
	confirm: "Confirmar",
	newChat: "Nuevo chat",
	get removeOwnerWarning() {
		return `Usted no puede eliminar al ${this.owner} de este chat. Intente cambiar el ${this.owner} primero.`;
	},
};

export const english: Language = {
	reSend: "Re-send",
	dateFormat: "en",
	me: "me",
	group: "Group",
	sending: "Sending...",
	accept: "Accept",
	locale: "en",
	newMsgs: "news",
	messages: "Messages",
	members: "Members",
	block: "Block",
	mute: "Mute",
	fullName: "Nombre completo",
	username: "Alias",
	email: "Correo",
	phone: "Teléfono",
	notSpecified: "<Sin especificar>",
	editing: "Editing",
	notName: "<Not named>",
	chat: "Chat",
	owner: "Owner",
	discard: "Discard",
	confirm: "Confirm",
	newChat: "New chat",
	get removeOwnerWarning() {
		return `You cannot remove the ${this.owner} from this chat. Try changing the ${this.owner} first.`;
	},
};

export const languageContext = createContext<Language>(english);
