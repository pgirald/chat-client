import { createContext, useContext, useEffect, useState } from "react";
import "./App.css";
import { E } from "./utils/General";
import { User } from "chat-api";
import { ChatSection } from "./components/ChatSection";
import { globalContext } from "./tests/src/Context";
import { Layout } from "./components/Layout";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { BsPersonFill } from "react-icons/bs";
import { themeContext } from "./global/Theme";
import { ChatPage } from "./components/ChatPage";
import { MockServer } from "./tests/src/Mocks";
import { LoadingModal } from "./components/LoadingModal";
import { sourceContext } from "./global/Source";

function App() {
	const source = useContext(sourceContext);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		(async () => {
			setLoading(true);
			await source.authenticate("Shemar_Lowe@gmail.com", "");
			setLoading(false);
		})();
	}, []);

	return (
		<LoadingModal visible={loading}>
			<Layout>{source.authenticated && <ChatPage />}</Layout>
		</LoadingModal>
	);
}

export default App;
