import { CSSProperties, ForwardedRef, forwardRef, useContext } from "react";
import { languageContext } from "../../global/Language";
import { chatImg, chatLabel } from "../../Chore/view";
import { ChatUI } from "../../Chore/Types";
import { fixedTheme, themeContext } from "../../global/Theme";
import { ProfileItem } from "./private/ProfileItem";
import { E, truncateStr } from "../../utils/StringOps";
import { useUser } from "../../global/User";
import { InfiniteScroll } from "../../utils/react/components/InfiniteScroll";
import { sourceContext } from "../../global/Source";
import { usePagination } from "../../utils/react/hooks/UsePagination";
import { ListLoader } from "../app_style/ListLoader";
import { unspecified } from "../../utils/General";
import { useChatsStore } from "../../global/Chats";

export type ChatsListProps = {
	className?: string;
	chats?: ChatUI[];
	filterChatName?: string;
	pageNumber?: number;
	itemsPerPage?: number;
	messagesPerPage?: number;
	infinite?: boolean;
	onChatSelected?: (chat: ChatUI, idx: number) => void;
	style?: CSSProperties;
	selected?: number;
};

export const ChatsList = forwardRef<HTMLDivElement, ChatsListProps>(
	(props: ChatsListProps, ref?: ForwardedRef<HTMLDivElement>) => {
		const user = useUser();
		const language = useContext(languageContext);
		const source = useContext(sourceContext);

		const replaceChats = useChatsStore((store) => store.replaceChats);
		const chats = useChatsStore((store) => store.requestedChats);

		const [_, hasMore, fetchChats] = usePagination(
			async function (page, count, chatName): Promise<[ChatUI[], boolean]> {
				return await source.getMyChats(
					page,
					count,
					chatName,
					props.messagesPerPage
				);
			},
			props.chats,
			props.filterChatName,
			props.pageNumber,
			props.itemsPerPage,
			false,
			(chats) => {
				replaceChats(chats);
			}
		);

		return (
			<InfiniteScroll
				className={`${E(props.className)} -:p-0 -:m-0 -:space-y-1`}
				style={props.style}
				ref={ref}
				loadMore={fetchChats}
				hasMore={hasMore}
				active={props.infinite}
				loader={<ListLoader />}
			>
				{chats.map((chat) => (
					<ProfileItem
						key={chat.id}
						name={chatLabel(chat, user, language)}
						img={chatImg(chat, user)}
						description={truncateStr(chat.messages.at(-1)?.content || "")}
						onClick={() => {
							props.onChatSelected?.(chat, chat.id);
						}}
						className="w-full p-1"
						style={{
							backgroundColor:
								chat.id === props.selected
									? fixedTheme.selectedItem
									: undefined,
						}}
						font={{ color: chat.id === props.selected ? "white" : undefined }}
					/>
				))}
			</InfiniteScroll>
		);
	}
);
