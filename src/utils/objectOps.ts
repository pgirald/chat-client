export function shallowCopy<T extends object>(obj: T): T {
	const copy: any = {};
	Object.keys(obj).forEach((key) => (copy[key] = (obj as any)[key]));
	return copy;
}

export type ObjectKeys<T extends object> = {
	readonly [key in keyof T]: string;
};

export function getKeys<T extends object>(obj: T): ObjectKeys<T> {
	let keys: any = {};
	Object.keys(obj).forEach((key) => (keys[key] = key));
	return keys;
}

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

export function isEmpty(o?: object) {
	if (!o) {
		return true;
	}
	return Object.keys(o).length === 0;
}

export function typedKeys<T extends object>(obj: T): (keyof T)[] {
	return Object.keys(obj) as (keyof T)[];
}
