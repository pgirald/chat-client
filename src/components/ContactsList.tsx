import {
	CSSProperties,
	useCallback,
	useContext,
	useRef,
	useState,
} from "react";
import { ContactUI, UserUI } from "../Chore/Types";
import { E, isEmpty as notSpecified, truncateStr } from "../utils";
import { ProfileItem } from "./ProfileItem";
import { fixedTheme } from "../global/Theme";
import profileImage from "../assets/profile.png";
import { userContext } from "../global/User";
import { Modal, ModalHandler } from "./Modal";
import { ContactForm } from "./ContactForm";
import { IoMdRemoveCircle } from "react-icons/io";
import { SearchTool } from "./SearchTool";
import { languageContext } from "../global/Language";

export type ContactsListProps = {
	children: ContactUI[];
	className?: string;
	onContactClicked?: (contact: ContactUI, idx: number) => void;
	onRemoveRequested?: (contact: ContactUI) => void;
	onSearchRequested?: (content: string) => void;
	style?: CSSProperties;
	selected?: number;
	showRemove?: boolean;
};

export function ContactsList(props: ContactsListProps) {
	const cuser = useContext(userContext);

	return (
		<div
			className={`${E(props.className)} -:overflow-y-scroll -:p-0 -:m-0 -:space-y-1`}
			style={props.style}
		>
			{props.children.map((contact, idx) => (
				<div className="flex-row space-x-2 items-center">
					{props.showRemove && (
						<IoMdRemoveCircle
							className="cursor-pointer"
							color={fixedTheme.red}
							onClick={() => props.onRemoveRequested?.(contact)}
						/>
					)}
					<ContactItem
						contact={contact}
						user={cuser}
						onClick={() => {
							props.onContactClicked?.(contact, idx);
						}}
					/>
				</div>
			))}
		</div>
	);
}

export type ContactItemProps = {
	user: ContactUI;
	contact: ContactUI;
	onClick?: () => void;
};

export function ContactItem({ contact, user, onClick }: ContactItemProps) {
	const language = useContext(languageContext);

	return (
		<ProfileItem
			key={contact.id}
			name={
				user.id === contact.id
					? `${contact.username} (${language.you})`
					: contact.username
			}
			img={contact.img || profileImage}
			description={truncateStr(contact.aboutMe || "")}
			onClick={() => {
				onClick?.();
			}}
			className="w-full p-1"
		/>
	);
}
