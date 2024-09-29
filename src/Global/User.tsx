import { User } from "chat-api";
import { createContext } from "react";
import { ContactUI } from "../Chore/Types";

export const userContext = createContext<ContactUI>({} as ContactUI);
