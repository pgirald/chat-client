import {
	CSSProperties,
	DOMAttributes,
	ForwardedRef,
	forwardRef,
	ReactNode,
	useEffect,
	useImperativeHandle,
	useRef,
} from "react";
import {
	scrolledToBottom,
	scrolledToTop,
	scrollToBottom,
} from "../../HTML_native";
import { unspecified } from "../../General";

export type InfiniteScrollProps = {
	className?: string;
	style?: CSSProperties;
	loader: ReactNode;
	hasMore: boolean;
	loadMore: () => Promise<any>;
	children: ReactNode[];
	reverse?: boolean;
	active?: boolean;
	listeners?: Omit<
		DOMAttributes<HTMLDivElement>,
		"children" | "dangerouslySetInnerHTML"
	>;
};

export const InfiniteScroll = forwardRef(
	(props: InfiniteScrollProps, ref?: ForwardedRef<HTMLDivElement>) => {
		const loadingRef = useRef(false);
		const scrollableRef = useRef<HTMLDivElement>(null);
		const shouldFixPositionRef = useRef(false);
		const scrollablePrevDimsRef = useRef({ scrollTop: 0, scrollHeight: 0 });

		const active = unspecified(props.active) ? true : props.active;

		const loaderWasReached: (elm: HTMLElement) => boolean = props.reverse
			? scrolledToTop
			: scrolledToBottom;

		useEffect(() => {
			if (props.reverse) {
				scrollToBottom(scrollableRef.current);
			}
		}, []);

		useEffect(() => {
			if (!props.reverse || !scrollableRef.current) {
				return;
			}
			scrollableRef.current.scrollTop =
				scrollableRef.current.scrollHeight -
				scrollablePrevDimsRef.current.scrollHeight +
				scrollablePrevDimsRef.current.scrollTop;
		}, [shouldFixPositionRef.current]);

		useImperativeHandle(ref, () => scrollableRef.current as HTMLDivElement);

		const { onScroll, ...listeners } = props.listeners || {
			onScroll: undefined,
		};

		return (
			<div
				ref={scrollableRef}
				className={`-:overflow-y-scroll -:p-0 -:m-0 ${props.className}`}
				style={props.style}
				onScroll={
					props.active
						? async (e) => {
								scrollablePrevDimsRef.current = {
									scrollHeight: e.currentTarget.scrollHeight,
									scrollTop: e.currentTarget.scrollTop,
								};
								onScroll?.(e);
								if (
									loaderWasReached(e.currentTarget) &&
									props.hasMore &&
									!loadingRef.current
								) {
									shouldFixPositionRef.current = !shouldFixPositionRef.current;
									loadingRef.current = true;
									await props.loadMore();
									loadingRef.current = false;
								}
							}
						: onScroll
				}
				{...listeners}
			>
				{props.hasMore && active && !!props.reverse && props.loader}
				{props.children}
				{props.hasMore && active && !props.reverse && props.loader}
			</div>
		);
	}
);
