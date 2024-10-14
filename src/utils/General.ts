export function sleep(ms: number, canceler?: AbortController) {
	return new Promise((r) => setTimeout(r, ms, { signal: canceler }));
}

export function EventHandler<T extends Function>() {
	const events: T[] = [];
	return {
		add(callBack: T) {
			events.push(callBack);
		},
		remove(callBack: T) {
			const idx = events.indexOf(callBack);
			if (idx !== -1) {
				events.splice(idx, 1);
			}
			return events;
		},
	};
}

export function empty(value: any) {
	return value === null || value === undefined;
}
