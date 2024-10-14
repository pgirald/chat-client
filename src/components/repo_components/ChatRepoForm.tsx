import { CSSProperties, ReactNode, useContext, useRef, useState } from "react";
import { ChatUI, ContactUI } from "../../Chore/Types";
import { ContactItem, ContactsList } from "../connections/ContactsList";
import { chatLabel } from "../../Chore/view";
import { languageContext } from "../../global/Language";
import profileImg from "../../assets/chat_default.png";
import { FaEdit } from "react-icons/fa";
import { fixedTheme, themeContext } from "../../global/Theme";
import { MdCancel } from "react-icons/md";
import { CgArrowsExchange } from "react-icons/cg";
import { BiSolidPlusCircle } from "react-icons/bi";
import { RxCross2 } from "react-icons/rx";
import { Modal, ModalHandler } from "../reusables/Modal";
import { ContactForm } from "./ContactRepoForm";
import { EditableImg } from "../reusables/EditableImg";
import { AppButton } from "../app_style/AppButton";
import { useGuardChanges } from "../../utils/react/hooks/UseGuardChanges";
import { GuardChangesButtons } from "../reusables/GuardChangesButtons";
import { AppInput } from "../app_style/AppInput";
import { BsDashLg, BsPlus } from "react-icons/bs";
import { WindowTemplate } from "../app_style/Template";
import { truncateStr } from "../../utils/StringOps";
import { Header, Info } from "../app_style/Info";
import { SearchTool } from "../app_style/SearchTool";
import { useUser } from "../../global/User";
import { Separator } from "../app_style/Separator";

export type ChatFormProps = {
	chat: ChatUI;
	onConfirm?: (chat: ChatUI) => void;
};

export function ChatForm(props: ChatFormProps) {
	const language = useContext(languageContext);
	const user = useUser();
	const theme = useContext(themeContext);

	const [selectedContact, setSelectedContact] = useState<ContactUI>(
		props.chat.owner
	);

	const [chat, setChat, discard, newChanges] = useGuardChanges(props.chat);

	const [memberName, setMemberName] = useState("");

	const contactInfoModalRef = useRef<ModalHandler>(null);
	const membersModalRef = useRef<ModalHandler>(null);
	const contactsModalRef = useRef<ModalHandler>(null);

	const isOwner = props.chat.owner.id === user.id;
	const contactsHeight = 60;
	const iconsClass = "icon";
	const iconsStyle: CSSProperties = {
		backgroundColor: fixedTheme.logoBlue,
		padding: 0,
	};
	const iconsSize = 18;
	const contactsWidth = 300;

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
							contactInfoModalRef.current?.openModal();
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
						contacts={chat.subs}
						className={`${isOwner ? "max-h-40" : "max-h-52"}`}
						onContactClicked={(contact) => {
							setSelectedContact(contact);
							contactInfoModalRef.current?.openModal();
						}}
						itemsHeight={contactsHeight}
						contactWrapper={({ children, contact }) => (
							<ContactWrapper
								contact={contact}
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
							>
								{children}
							</ContactWrapper>
						)}
					/>
				}
				headerRight={
					isOwner && (
						<CgArrowsExchange
							className={iconsClass}
							style={iconsStyle}
							size={iconsSize}
							strokeWidth={0.5}
							color="white"
							onClick={() => {
								contactsModalRef.current?.openModal();
							}}
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
			<Modal ref={contactInfoModalRef}>
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
							contacts={chat.subs.filter((sub) =>
								sub.username.toLowerCase().includes(memberName.toLowerCase())
							)}
							onContactClicked={(contact) => {
								setChat({ ...chat, owner: contact });
								membersModalRef.current?.closeModal();
							}}
							className="ml-[32px]"
						/>
					</div>
				</WindowTemplate>
			</Modal>
			<Modal ref={contactsModalRef}>
				<SelectedContactsList members={chat.subs} />
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

	function ContactWrapper({
		children,
		contact,
		onRemoveRequested,
	}: {
		children: ReactNode;
		contact: ContactUI;
		onRemoveRequested?: (contact: ContactUI) => void;
	}) {
		return (
			<div className="flex-row space-x-2 items-center">
				<BsDashLg
					className="icon"
					style={{
						alignSelf: "center",
						backgroundColor: fixedTheme.red,
					}}
					color="white"
					onClick={() => {
						onRemoveRequested?.(contact);
					}}
					strokeWidth={5}
					size={iconsSize}
				/>
				{children}
			</div>
		);
	}

	function SelectedContactsList({ members }: { members: ContactUI[] }) {
		const [selectedMembers, setSelectedMembers] =
			useState<ContactUI[]>(members);
		const [username, setUsername] = useState<string | undefined>();

		return (
			<WindowTemplate header={language.addMembers} wrapperClassName="space-y-5">
				<div className="flex-row h-96">
					<div className="h-full space-y-2">
						<Header className="h-[10%]" content={language.allContacts} />
						<div className="h-full">
							<SearchTool
								className="h-[10%] rounded-tl-md"
								showLen
								onSearchRequested={(value) => setUsername(value)}
							/>
							<ContactsList
								className="h-[80%]"
								style={{ width: contactsWidth }}
								infinite
								filterUsername={username}
								font={(contact) => ({
									color: selectedMembers.find(
										(member) => member.id === contact.id
									)
										? fixedTheme.white
										: theme.content,
								})}
								contactWrapper={(props) => {
									const selected = !!selectedMembers.find(
										(member) => member.id === props.contact.id
									);
									return (
										<div
											className="flex-row items-center space-x-2 pr-2"
											style={{
												background: selected
													? fixedTheme.selectedItem
													: undefined,
											}}
											onClick={() => {
												if (
													!selectedMembers.find(
														(member) => member.id === props.contact.id
													)
												) {
													setSelectedMembers([
														...selectedMembers,
														props.contact,
													]);
													return;
												}
												if (props.contact.id === chat.owner.id) {
													alert(language.removeOwnerWarning);
													return;
												}
												setSelectedMembers(
													selectedMembers.filter(
														(member) => member.id !== props.contact.id
													)
												);
											}}
										>
											{props.children}
											<input type="checkbox" checked={selected} readOnly />
										</div>
									);
								}}
							/>
						</div>
					</div>
					<Separator />
					<div className="space-y-2">
						<Header content={language.selected} />
						<ContactsList
							className="pr-2"
							style={{ width: contactsWidth }}
							contacts={selectedMembers}
							contactWrapper={(props) => (
								<ContactWrapper
									contact={props.contact}
									onRemoveRequested={(contact) => {
										if (contact.id === chat.owner.id) {
											alert(language.removeOwnerWarning);
											return;
										}
										setSelectedMembers(
											selectedMembers.filter(
												(member) => member.id !== contact.id
											)
										);
									}}
								>
									{props.children}
								</ContactWrapper>
							)}
						/>
					</div>
				</div>
				<AppButton
					content={language.confirm}
					style={{ backgroundColor: fixedTheme.logoBlue }}
					onClick={() => {
						setChat({ ...chat, subs: selectedMembers });
						contactsModalRef.current?.closeModal();
					}}
				/>
			</WindowTemplate>
		);
	}
}
