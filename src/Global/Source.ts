import { createContext } from "react";
import { Source } from "../Chore/Source";
import { MockServer } from "../tests/src/Mocks";

export const sourceContext = createContext<Source>({} as any);
