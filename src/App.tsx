import { createContext, useContext, useEffect, useState } from "react";
import "./App.css";
import { User } from "chat-api";
import { ChatSection } from "./components/ChatSection";
import { globalContext } from "./tests/src/Context";
import { Layout } from "./components/Layout";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { BsPersonFill } from "react-icons/bs";
import { themeContext } from "./global/Theme";
import { MockServer } from "./tests/src/Mocks";
import { sourceContext } from "./global/Source";
import { useChatListener } from "./components/UseChatListener";

function App() {
	const connectionStatus = useChatListener();
	const source = useContext(sourceContext);

	return (
		<Layout>
			{source.authenticated && <ChatSection className="h-full w-full" userConnected={connectionStatus} />}
		</Layout>
	);
}

export default App;
