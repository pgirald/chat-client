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
	firstName: string;
	lastName: string;
	you: string;
	settings: string;
	language: string;
	about: string;
	chats: string;
	chatApproval: string;
	discoverability: string;
	enableNotifications: string;
	seenStatus: string;
	showOnlineStatus: string;
	notificationTone: string;
	groupsTone: string;
	privileges: string;
	defaultNotificationRingtone: string;
	defaultTheme: string;
	manageUsers: string;
	broadcast: string;
	customRingtone: string;
	defaults: string;
	userDeletionBan: string;
	userPrivileges: string;
	ban: string;
	delete: string;
	profile: string;
	admon: string;
	logOut: string;
	english: string;
	spanish: string;
	manageRoles: string;
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
	username: "Alias",
	email: "Correo",
	phone: "Teléfono",
	notSpecified: "<Sin especificar>",
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
	firstName: "Nombre",
	lastName: "Apellido",
	you: "Usted",
	settings: "Opciones",
	language: "Lenguaje",
	about: "Nosotros",
	chats: "Chats",
	chatApproval: "Aprobación de Chats",
	discoverability: "Ser visible",
	enableNotifications: "Notificaciones",
	seenStatus: "Mostrar estado de visto",
	showOnlineStatus: "Mostrar estado Actual",
	notificationTone: "Tono de notificación",
	groupsTone: "Tono de grupos",
	privileges: "Privilegios",
	defaultNotificationRingtone: "Tono de notificación por defecto",
	defaultTheme: "Tema por defecto",
	manageUsers: "Administrar usuarios/grupos",
	broadcast: "Difundir",
	customRingtone: "Tono personalizado",
	defaults: "Predeterminados",
	userDeletionBan: "Baneo/Eliminación de usarios",
	userPrivileges: "Privilegios de usuario",
	ban: "Banear",
	delete: "Eliminar",
	profile: "Perfil",
	admon: "Administrador",
	logOut: "Salir",
	english: "Inglés",
	spanish: "Español",
	manageRoles: "Administrar roles",
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
	username: "Username",
	email: "Email",
	phone: "Phone",
	notSpecified: "<Not specified>",
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
	firstName: "First name",
	lastName: "Last name",
	you: "You",
	settings: "Settings",
	language: "Language",
	about: "About",
	chats: "Chats",
	chatApproval: "Chat approval",
	discoverability: "Discoverability",
	enableNotifications: "Enable notifications",
	seenStatus: "Seen status",
	showOnlineStatus: "Show online status",
	notificationTone: "Notifications tone",
	groupsTone: "Groups tone",
	privileges: "Privileges",
	defaultNotificationRingtone: "Default notification tone",
	defaultTheme: "Default theme",
	manageUsers: "Manage users/groups",
	broadcast: "Broadcast",
	customRingtone: "Custom ringtone",
	defaults: "Defaults",
	userDeletionBan: "User deletion/ban",
	userPrivileges: "User privileges",
	ban: "Ban",
	delete: "Delete",
	profile: "Profile",
	admon: "Admon",
	logOut: "Log out",
	english: "English",
	spanish: "Spanish",
	manageRoles: "Manage roles",
};

export type LanguageContext = Language & { set?: (value: Language) => void };

export const languageContext = createContext<LanguageContext>(english);
