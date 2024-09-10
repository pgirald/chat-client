import { User } from "chat-api";
import { createContext } from "react";

export const userContext = createContext<User>({} as User);
