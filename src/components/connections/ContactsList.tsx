import {
	CSSProperties,
	ReactNode,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import { ContactUI, UserUI } from "../../Chore/Types";
import { fixedTheme } from "../../global/Theme";
import profileImage from "../../assets/profile.png";
import { languageContext } from "../../global/Language";
import { BsDashLg } from "react-icons/bs";
import { E, truncateStr } from "../../utils/StringOps";
import { FontProps, ProfileItem } from "./private/ProfileItem";
import { useUser } from "../../global/User";
import { sourceContext } from "../../global/Source";
import { PulseLoader } from "react-spinners";
import { InfiniteScroll } from "../../utils/react/components/InfiniteScroll";
import { empty } from "../../utils/General";

export type ContactsListProps = {
	contacts?: ContactUI[];
	infinite?: boolean;
	className?: string;
	onContactClicked?: (contact: ContactUI, idx: number) => void;
	style?: CSSProperties;
	itemsHeight?: number;
	pageNumber?: number;
	itemsPerPage?: number;
	font?: (contact: ContactUI) => FontProps;
	contactWrapper?: (props: {
		children: ReactNode;
		contact: ContactUI;
	}) => JSX.Element;
	filterUsername?: string;
};

type PagInfo = { pageNumber: number; itemsCount: number };

export function ContactsList(props: ContactsListProps) {
	const source = useContext(sourceContext);
	const cuser = useUser();

	const pageInfoRef = useRef<PagInfo>({
		pageNumber: props.pageNumber || 0,
		itemsCount: props.itemsPerPage || 8,
	});

	const [contacts, setContacts] = useState<ContactUI[]>(props.contacts || []);
	const [hasMore, setHasMore] = useState(true);

	useEffect(() => {
		props.contacts && setContacts(props.contacts);
	}, [props.contacts]);

	useEffect(() => {
		if (!props.contacts) {
			fetchContacts();
		}
	}, []);

	useEffect(() => {
		(async () => {
			if (empty(props.filterUsername)) {
				return;
			}
			setContacts([]);
			setHasMore(true);
			pageInfoRef.current.pageNumber = 0;
			await fetchContacts();
		})();
	}, [props.filterUsername]);

	async function fetchContacts() {
		const newContacts = await source.getContacts(
			pageInfoRef.current.pageNumber,
			pageInfoRef.current.itemsCount,
			props.filterUsername || undefined
		);
		setHasMore(newContacts.length !== 0);
		setContacts([...contacts, ...newContacts]);
		pageInfoRef.current.pageNumber++;
	}

	const emptyWrapper = ({ children }: { children: ReactNode }) => (
		<>{children}</>
	);

	const ContactWrapper = props.contactWrapper || emptyWrapper;

	return (
		<InfiniteScroll
			className={props.className}
			style={props.style}
			loadMore={fetchContacts}
			hasMore={hasMore}
			active={empty(props.infinite) ? false : props.infinite}
			loader={
				<div className="w-full items-center">
					<PulseLoader color={fixedTheme.logoBlue} />
				</div>
			}
		>
			{contacts.map((contact, idx) => (
				<ContactWrapper contact={contact}>
					<ContactItem
						height={props.itemsHeight}
						contact={contact}
						user={cuser}
						onClick={() => {
							props.onContactClicked?.(contact, idx);
						}}
						font={props.font?.(contact)}
					/>
				</ContactWrapper>
			))}
		</InfiniteScroll>
	);
}

export type ContactItemProps = {
	user: ContactUI;
	contact: ContactUI;
	height?: number;
	onClick?: () => void;
	font?: FontProps;
};

export function ContactItem({
	contact,
	user,
	onClick,
	height,
	font,
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
			className="w-full p-1 text-inherit"
			font={font}
		/>
	);
}
