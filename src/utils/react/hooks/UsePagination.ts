import { useEffect, useRef, useState } from "react";
import { unspecified } from "../../General";

type PagInfo = { pageNumber: number; itemsCount: number };

export function usePagination<T extends object, F extends any>(
	fetcher: (
		pageNumber: number,
		itemsCount: number,
		filter?: F
	) => Promise<[T[], boolean]>,
	elements?: T[],
	filter?: F,
	pageNumber?: number,
	itemsPerPage?: number
): [T[], boolean, () => Promise<void>] {
	const pageInfoRef = useRef<PagInfo>({
		pageNumber: pageNumber || 0,
		itemsCount: itemsPerPage || 8,
	});

	const [elms, setElms] = useState<T[]>(elements || []);
	const [hasMore, setHasMore] = useState(true);

	useEffect(() => {
		if (elements) {
			setElms(elements);
		}
	}, [elements]);

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
			setElms([]);
			setHasMore(true);
			pageInfoRef.current.pageNumber = 0;
			await fetchElms([]);
		})();
	}, [filter]);

	return [elms, hasMore, fetch];

	async function fetchElms(contacts: T[]) {
		const [newContacts, more] = await fetcher(
			pageInfoRef.current.pageNumber,
			pageInfoRef.current.itemsCount,
			filter
		);
		setHasMore(more);
		setElms([...contacts, ...newContacts]);
		pageInfoRef.current.pageNumber++;
	}

	function fetch() {
		return fetchElms(elms);
	}
}
