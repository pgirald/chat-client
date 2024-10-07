import {
	CSSProperties,
	useCallback,
	useContext,
	useRef,
	useState,
} from "react";
import { ContactUI, UserUI } from "../../Chore/Types";
import { fixedTheme } from "../../global/Theme";
import profileImage from "../../assets/profile.png";
import { userContext } from "../../global/User";
import { languageContext } from "../../global/Language";
import { BsDashLg } from "react-icons/bs";
import { E, truncateStr } from "../../utils/StringOps";
import { ProfileItem } from "./private/ProfileItem";

export type ContactsListProps = {
	children: ContactUI[];
	className?: string;
	onContactClicked?: (contact: ContactUI, idx: number) => void;
	onRemoveRequested?: (contact: ContactUI) => void;
	onSearchRequested?: (content: string) => void;
	style?: CSSProperties;
	selected?: number;
	showRemove?: boolean;
	removeSize?: number;
	itemsHeight?: number;
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
						<BsDashLg
							className="icon"
							style={{ alignSelf: "center", backgroundColor: fixedTheme.red }}
							color="white"
							onClick={() => props.onRemoveRequested?.(contact)}
							strokeWidth={5}
							size={props.removeSize || 20}
						/>
					)}
					<ContactItem
						height={props.itemsHeight}
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
	height?: number;
	onClick?: () => void;
};

export function ContactItem({
	contact,
	user,
	onClick,
	height,
}: ContactItemProps) {
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
			height={height}
			className="w-full p-1"
		/>
	);
}
