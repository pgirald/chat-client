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

function App() {
	// const [username, setUsername] = useState("");

	// return (
	// 	<div className="w-full h-full items-center justify-center">
	// 		{username ? (
	// 			<ChatPage
	// 				owner={{ id: username, username: username }}
	// 				onConnectionError={(e) => {
	// 					alert(e.message);
	// 					setUsername("");
	// 				}}
	// 			/>
	// 		) : (
	// 			<UserNameSelector onConfirm={(username) => setUsername(username)} />
	// 		)}
	// 	</div>
	// );
	useEffect(() => {}, []);
	const theme = useContext(themeContext);

	return (
			<Layout>
				<ChatSection
					className="w-full h-full"
					style={{ backgroundColor: theme.bg }}
					userConnected={true}
				>
					{globalContext.chats}
				</ChatSection>
			</Layout>
	);
}

function UserNameSelector(props: {
	className?: string;
	onConfirm?: (username: string) => void;
}) {
	const [txt, setTxt] = useState("");
	return (
		<div className={`${E(props.className)} h-fit w-fit p-0 m-0`}>
			<input
				className="w-full mb-1 rounded-lg border-t-stone-500 border-[2px] pl-1 h-8"
				placeholder="Type an username"
				value={txt}
				onChange={(e) => setTxt(e.currentTarget.value)}
			/>
			<button className="w-full h-fit rounded-md bg-green-500">
				<span
					className="font-roboto font-bold text-white text-[14px]"
					onClick={() => {
						props.onConfirm?.(txt);
					}}
				>
					Confirm
				</span>
			</button>
		</div>
	);
}

export default App;
