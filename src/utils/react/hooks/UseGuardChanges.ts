import { useEffect, useState } from "react";

export function useGuardChanges<T extends Object>(
	initial: T
): [T, (value: T) => void, () => void, boolean] {
	const [state, setState] = useState(initial);
	const [newChanges, setNewChanges] = useState(false);

	useEffect(() => {
		setProxy(initial);
	}, [initial]);

	function setProxy(value: T) {
		if (value === initial) {
			setNewChanges(false);
		} else if (!newChanges) {
			setNewChanges(true);
		}
		setState(value);
	}

	function discard() {
		setProxy(initial);
	}

	return [state, setProxy, discard, newChanges];
}
