import { CSSProperties, useContext, useRef, useState } from "react";
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
import { CgArrowsExchange } from "react-icons/cg";
import { BiSolidPlusCircle } from "react-icons/bi";
import { RxCross2 } from "react-icons/rx";
import { truncateStr } from "../utils";
import { Modal, ModalHandler } from "./Modal";
import { ContactForm } from "./ContactForm";
import { SearchTool } from "./SearchTool";
import { EditableImg } from "./EditableImg";
import { AppButton } from "./AppButton";
import { useGuardChanges } from "./UseGuardChanges";
import { GuardChangesButtons } from "./GuardChangesButtons";
import { AppInput } from "./AppInput";
import { BsPlus } from "react-icons/bs";

export type ChatFormProps = {
	chat: ChatUI;
	onConfirm?: (chat: ChatUI) => void;
};

export function ChatForm(props: ChatFormProps) {
	const language = useContext(languageContext);
	const user = useContext(userContext);
	const theme = useContext(themeContext);
	const [selectedContact, setSelectedContact] = useState<ContactUI>(
		props.chat.owner
	);
	const [memberName, setMemberName] = useState("");

	const [chat, setChat, discard, newChanges] = useGuardChanges(props.chat);

	const contactModalRef = useRef<ModalHandler>(null);
	const membersModalRef = useRef<ModalHandler>(null);

	const isOwner = props.chat.owner.id === user.id;
	const contactsHeight = 60;
	const iconsClass = "icon";
	const iconsStyle: CSSProperties = {
		backgroundColor: fixedTheme.logoBlue,
		padding: 0,
	};
	const iconsSize = 18;

	return (
		<WindowTemplate
			wrapperClassName="space-y-5"
			header={chatLabel(chat, user, language)}
		>
			<div className="flex-row space-x-4">
				<EditableImg
					src={props.chat.img || profileImg}
					canChange={isOwner}
					size={100}
					changeSize={iconsSize}
				/>
				<AppInput
					className="w-[15ch] font-bold self-center text-2xl"
					style={{ color: theme.content }}
					onChange={(value) => setChat({ ...chat, name: value })}
					value={chat.name}
					placeholder={truncateStr(chat.name || language.notName, 12)}
					active={isOwner}
					showEdit={isOwner}
				/>
			</div>
			<Info
				contentClass="not-italic"
				header={language.owner}
				content={
					<ContactItem
						contact={chat.owner}
						user={user}
						onClick={() => {
							setSelectedContact(chat.owner);
							contactModalRef.current?.openModal();
						}}
						height={contactsHeight}
					/>
				}
				headerRight={
					isOwner && (
						<CgArrowsExchange
							className={iconsClass}
							style={iconsStyle}
							color={"white"}
							size={iconsSize}
							onClick={() => {
								membersModalRef.current?.openModal();
							}}
						/>
					)
				}
			/>
			<Info
				contentClass="not-italic"
				header={language.members}
				content={
					<ContactsList
						className="max-h-40"
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
							setChat({
								...chat,
								subs: chat.subs.filter((sub) => sub.id !== contact.id),
							});
						}}
						itemsHeight={contactsHeight}
						removeSize={iconsSize}
					>
						{chat.subs}
					</ContactsList>
				}
				headerRight={
					isOwner && (
						<BsPlus
							className={iconsClass}
							style={iconsStyle}
							size={iconsSize}
							strokeWidth={0.5}
							color="white"
						/>
					)
				}
			/>
			<Info
				header={language.customRingtone}
				content={chat.ringtone?.name || language.notSpecified}
				headerRight={
					isOwner && (
						<CgArrowsExchange
							className={iconsClass}
							style={iconsStyle}
							color={"white"}
							size={iconsSize}
							onClick={() => {
								membersModalRef.current?.openModal();
							}}
						/>
					)
				}
			/>
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
							showLen={false}
							className="w-full"
							value={memberName}
							onSearchChange={setMemberName}
						/>
						<ContactsList
							onContactClicked={(contact) => {
								setChat({ ...chat, owner: contact });
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
				<GuardChangesButtons
					onDiscardRequested={discard}
					onConfirmRequested={() => {
						props.onConfirm?.(chat);
					}}
				/>
			)}
		</WindowTemplate>
	);
}
