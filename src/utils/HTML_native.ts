export function setNativeValue(
	element: HTMLInputElement | HTMLTextAreaElement,
	value: string
) {
	const valueSetter = Object.getOwnPropertyDescriptor(element, "value")!.set;
	const prototype = Object.getPrototypeOf(element);
	const prototypeValueSetter = Object.getOwnPropertyDescriptor(
		prototype,
		"value"
	)!.set;

	if (valueSetter && valueSetter !== prototypeValueSetter) {
		prototypeValueSetter?.call(element, value);
	} else {
		valueSetter?.call(element, value);
	}
}

export function scrollToBottom(elm: HTMLElement | null) {
	if (elm) {
		elm.scrollTo(0, elm.scrollHeight);
	}
}

export function scrolledToBottom(elm: HTMLElement) {
	//return elm.scrollTop === elm.scrollHeight - elm.offsetHeight;
	return Math.abs(elm.scrollHeight - (elm.scrollTop + elm.offsetHeight)) <= 1;
	//return div.scrollTop + div.clientHeight === div.scrollHeight;
}

export function scrolledToTop(elm: HTMLElement) {
	return elm.scrollTop === 0;
}
