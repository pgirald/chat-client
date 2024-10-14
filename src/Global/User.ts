import { User } from "chat-api";
import { createContext, useContext } from "react";
import { ContactUI } from "../Chore/Types";
import { sourceContext } from "./Source";

//export const userContext = createContext<ContactUI>({} as ContactUI);

export function useUser() {
	const source = useContext(sourceContext);
	if (source === undefined) {
		throw Error(
			"In order to use this hook, you must use the source context provider and provide a source value."
		);
	}
	return source.user;
}
