export type ObjectKeys<T extends object> = {
	readonly [key in keyof T]: string;
};

export type CoercionObject<T extends object> = {
	readonly [key in keyof T]: (value: any) => T[key];
};

export type ConvertPropsTo<O extends object, T> = { [key in keyof O]: T };

export function shallowCopy<T extends object>(obj: T): T {
	const copy: any = {};
	Object.keys(obj).forEach((key) => (copy[key] = (obj as any)[key]));
	return copy;
}

export function getKeys<T extends object>(obj: T): ObjectKeys<T> {
	let keys: any = {};
	Object.keys(obj).forEach((key) => (keys[key] = key));
	return keys;
}

export function getCoercionObj<T extends object>(obj: T): CoercionObject<T> {
	const coercionObj: any = {};
	Object.keys(obj).forEach(
		(key) => (coercionObj[key] = getCoercionFunc((obj as any)[key]))
	);
	return coercionObj;
}

export function getDateTimeString(date: Date) {
	return date.toLocaleString();
}

export function removeVoid(o: object) {
	let newO = {};
	let value: any;
	for (const key in o) {
		value = (o as any)[key];
		if (value === "" || value === undefined || value === null) {
			continue;
		}
		(newO as any)[key] = value;
	}
	return newO;
}

export function isEmpty(o?: object) {
	if (!o) {
		return true;
	}
	return Object.keys(o).length === 0;
}

export function E(value: any) {
	return value ? value : "";
}

function getCoercionFunc(value: any) {
	if (coercionFuncs[typeof value]) {
		return coercionFuncs[typeof value];
	}
	return identity;
}

function identity(value: any) {
	return value;
}

const coercionFuncs = {
	[typeof ""]: String,
	[typeof 0]: Number,
	[typeof false]: Boolean,
};

export class InvalidParamsError extends Error {
	constructor(message?: string) {
		super(message);
		this.name = "InvalidParamsError";
	}
}

export function range(start: number, end: number): number[] {
	if (start > end) {
		throw new InvalidParamsError("Start cannot be greater than end");
	}
	const len = Math.abs(end - start + 1);
	const arr = Array(len);
	for (let i = 0; i < len; i++) {
		arr[i] = start + i;
	}
	return arr;
}

export function typedKeys<T extends object>(obj: T): (keyof T)[] {
	return Object.keys(obj) as (keyof T)[];
}

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
