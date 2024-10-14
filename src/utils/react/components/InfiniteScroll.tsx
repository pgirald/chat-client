import {
	CSSProperties,
	ForwardedRef,
	forwardRef,
	ReactNode,
	useRef,
} from "react";
import { scrolledToBottom } from "../../HTML_native";
import { empty } from "../../General";

export type InfiniteScrollProps = {
	className?: string;
	style?: CSSProperties;
	loader: ReactNode;
	hasMore: boolean;
	loadMore: () => Promise<any>;
	children: ReactNode;
	active?: boolean;
};

export const InfiniteScroll = forwardRef(
	(props: InfiniteScrollProps, ref?: ForwardedRef<HTMLDivElement>) => {
		const loadingRef = useRef(false);

		const active = empty(props.active) ? true : props.active;

		return (
			<div
				ref={ref}
				className={`-:overflow-y-scroll -:p-0 -:m-0 ${props.className}`}
				style={props.style}
				onScroll={
					props.active
						? async (e) => {
								if (
									scrolledToBottom(e.currentTarget) &&
									props.hasMore &&
									!loadingRef.current
								) {
									loadingRef.current = true;
									await props.loadMore();
									loadingRef.current = false;
								}
							}
						: undefined
				}
			>
				{props.children}
				{props.hasMore && active && props.loader}
			</div>
		);
	}
);
