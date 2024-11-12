import { useEffect, useReducer, useRef, useState } from "react";
import { unspecified } from "../../General";

type PagInfo = { pageNumber: number; itemsCount: number };

const empty: any[] = [];

export function usePagination<T extends object, F extends any>(
	fetcher: (
		pageNumber: number,
		itemsCount: number,
		filter?: F
	) => Promise<[T[], boolean]>,
	elements?: T[],
	filter?: F,
	pageNumber?: number,
	itemsPerPage?: number,
	reverse?: boolean,
	onNextPage?: (elms: T[]) => void,
	upToDate: boolean = true
): [
	T[],
	boolean,
	() => Promise<void>,
	(
		elements?: T[],
		_pageNumber?: number,
		_itemsPerPage?: number,
		forceRender?: boolean
	) => void,
] {
	const defaultPage = reverse ? -1 : 0;
	const defaultPageInfo = getDefaultPageInfo(pageNumber, itemsPerPage);
	const pageInfoRef = useRef<PagInfo>(defaultPageInfo);
	const elmsRef = useRef<T[]>(elements || empty);
	const prevElms = useRef<T[] | undefined>(elements);
	const hasMoreRef = useRef(true);

	const [, forceUpdate] = useReducer((x) => x + 1, 0);

	if (upToDate && prevElms.current !== elements) {
		prevElms.current = elements;
		elmsRef.current = elements || empty;
	}

	useEffect(() => {
		if (!elements) {
			fetchElms([]);
		}
	}, []);

	useEffect(() => {
		(async () => {
			if (unspecified(filter)) {
				return;
			}
			elmsRef.current = [];
			hasMoreRef.current = true;
			pageInfoRef.current.pageNumber = defaultPage;
			await fetchElms([]);
		})();
	}, [filter]);

	return [elmsRef.current, hasMoreRef.current, fetch, reset];

	async function fetchElms(_elms: T[]) {
		const [newElms, more] = await fetcher(
			pageInfoRef.current.pageNumber,
			pageInfoRef.current.itemsCount,
			filter
		);
		hasMoreRef.current = more;
		if (reverse) {
			elmsRef.current = [...newElms, ..._elms];
		} else {
			elmsRef.current = [..._elms, ...newElms];
		}
		if (onNextPage) {
			onNextPage(elmsRef.current);
		} else {
			forceUpdate();
		}
		pageInfoRef.current.pageNumber += reverse ? -1 : 1;
	}

	function fetch() {
		return fetchElms(elmsRef.current);
	}

	function getDefaultPageInfo(pageNumber?: number, itemsPerPage?: number) {
		return {
			pageNumber: pageNumber || defaultPage,
			itemsCount: itemsPerPage || 8,
		};
	}

	function reset(
		elements?: T[],
		_pageNumber?: number,
		_itemsPerPage?: number,
		forceRender: boolean = true
	) {
		prevElms.current = elements;
		elmsRef.current = elements || empty;
		hasMoreRef.current = true;
		pageInfoRef.current = getDefaultPageInfo(
			_pageNumber || pageNumber,
			_itemsPerPage || itemsPerPage
		);
		if (forceRender) {
			forceUpdate();
		}
	}
}
