import { useContext, useRef, useState } from "react";
import { ChatUI, ContactUI } from "../Chore/Types";
import { Header, Info, WindowTemplate } from "./Styling";
import { ContactItem, ContactsList } from "./ContactsList";
import { chatLabel } from "./utils";
import { languageContext } from "../global/Language";
import { userContext } from "../global/User";
import profileImg from "../assets/chat_default.png";
import { FaEdit } from "react-icons/fa";
import { fixedTheme, themeContext } from "../global/Theme";
import { MdCancel } from "react-icons/md";
import { RiExchangeFill } from "react-icons/ri";
import { BiSolidPlusCircle } from "react-icons/bi";
import { RxCross2 } from "react-icons/rx";
import { truncateStr } from "../utils";
import { Modal, ModalHandler } from "./Modal";
import { ContactForm } from "./ContactForm";
import { SearchTool } from "./SearchTool";

export type ChatFormProps = {
	chat: ChatUI;
	onConfirm?: (chat: ChatUI) => void;
};

export function ChatForm(props: ChatFormProps) {
	const language = useContext(languageContext);
	const user = useContext(userContext);
	const theme = useContext(themeContext);
	const imgSize = 100;

	const [editingName, setEditingName] = useState(false);
	const [selectedContact, setSelectedContact] = useState<ContactUI>(
		props.chat.owner
	);
	const [memberName, setMemberName] = useState("");
	const [chat, setChat] = useState(props.chat);
	const [newChanges, setNewChanges] = useState(false);

	const contactModalRef = useRef<ModalHandler>(null);
	const membersModalRef = useRef<ModalHandler>(null);

	const isOwner = props.chat.owner.id === user.id;

	return (
		<WindowTemplate
			wrapperClassName="space-y-5"
			header={chatLabel(chat, user, language)}
		>
			<div className="flex-row space-x-2">
				<ChatImg />
				<input
					className="h-fit w-[15ch] p-2 self-center font-Roboto font-bold text-2xl rounded-r-full"
					style={{
						pointerEvents: isOwner ? "auto" : "none",
						borderWidth: isOwner ? 1 : 0,
						borderColor: theme.separator,
					}}
					onChange={(e) => {
						setChatProxy({ ...chat, name: e.target.value });
					}}
					value={
						editingName
							? chat.name || ""
							: truncateStr(chat.name || language.notName, 12)
					}
					onFocus={() => {
						setEditingName(true);
					}}
					onBlur={() => {
						setEditingName(false);
					}}
				/>
			</div>
			<div>
				<div className="flex-row space-x-1 items-center">
					<Header content={language.owner} />
					{isOwner && (
						<RiExchangeFill
							className="cursor-pointer"
							color={fixedTheme.logoBlue}
							size={20}
							onClick={() => {
								membersModalRef.current?.openModal();
							}}
						/>
					)}
				</div>
				<ContactItem
					contact={chat.owner}
					user={user}
					onClick={() => {
						setSelectedContact(chat.owner);
						contactModalRef.current?.openModal();
					}}
				/>
			</div>
			<div className="relative w-fit h-fit">
				<div className="flex-row space-x-1 items-center">
					<Header content={language.members} />
					{isOwner && (
						<BiSolidPlusCircle
							className="cursor-pointer bg-white rounded-full"
							size={20}
							color={fixedTheme.logoBlue}
						/>
					)}
				</div>
				<ContactsList
					className="max-h-42"
					onContactClicked={(contact) => {
						setSelectedContact(contact);
						contactModalRef.current?.openModal();
					}}
					showRemove={isOwner}
					onRemoveRequested={(contact) => {
						if (contact.id === chat.owner.id) {
							alert(language.removeOwnerWarning);
							return;
						}
						setChatProxy({
							...chat,
							subs: chat.subs.filter((sub) => sub.id !== contact.id),
						});
					}}
				>
					{chat.subs}
				</ContactsList>
			</div>
			<Modal ref={contactModalRef}>
				<ContactForm contact={selectedContact} />
			</Modal>
			<Modal ref={membersModalRef}>
				<WindowTemplate
					className="w-80"
					identation={0}
					header={language.members}
				>
					<div>
						<SearchTool
							search={false}
							className="w-full"
							value={memberName}
							onSearchChange={setMemberName}
						/>
						<ContactsList
							onContactClicked={(contact) => {
								setChatProxy({ ...chat, owner: contact });
								membersModalRef.current?.closeModal();
							}}
							className="ml-[32px]"
						>
							{chat.subs.filter((sub) =>
								sub.username.toLowerCase().includes(memberName.toLowerCase())
							)}
						</ContactsList>
					</div>
				</WindowTemplate>
			</Modal>
			{newChanges && (
				<div className="flex-row space-x-2">
					<div
						className="rounded-md p-1 cursor-pointer font-Roboto text-white font-bold text-sm"
						style={{ backgroundColor: fixedTheme.logoOrange }}
						onClick={() => {
							setChatProxy(props.chat);
						}}
					>
						{language.discard}
					</div>
					<div
						className="rounded-md p-1 cursor-pointer font-Roboto text-white font-bold text-sm"
						style={{ backgroundColor: fixedTheme.logoBlue }}
						onClick={() => {
							props.onConfirm?.(chat);
						}}
					>
						{language.confirm}
					</div>
				</div>
			)}
		</WindowTemplate>
	);

	function ChatImg() {
		return (
			<div className="w-fit h-fit relative items-end justify-end">
				<img
					className="rounded-full"
					src={chat.img || profileImg}
					height={imgSize}
					width={imgSize}
				/>
				{isOwner && (
					<RiExchangeFill
						className="absolute bg-white rounded-full cursor-pointer"
						color={fixedTheme.logoBlue}
						size={20}
					/>
				)}
			</div>
		);
	}

	function setChatProxy(chat: ChatUI) {
		if (chat === props.chat) {
			setNewChanges(false);
		} else if (!newChanges) {
			setNewChanges(true);
		}
		setChat(chat);
	}
}
