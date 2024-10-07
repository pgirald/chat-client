export function sleep(ms: number) {
	return new Promise((r) => setTimeout(r, ms));
}

export type EventHandler<T extends Function> = {
	add: (callBack: T) => void;
	remove: (callback: T) => void;
};

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
