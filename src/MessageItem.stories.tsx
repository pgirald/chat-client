import * as React from "react";
import { fakeViews } from "../tests/src/Mocks";
import { MessageItem } from "./components/MessagePanel";
import { english, languageContext } from "./Global/Language";
import "./index.css";

// export const SendingMessage = () => (
// 	<languageContext.Provider value={english}>
// 		<MessageItem
// 			isFromUser={true}
// 			message={fakeViews[0].chats[0].messages[0]}
// 		/>
// 	</languageContext.Provider>
// );

export const SendingMessage = () => (
	<div className="w-fit h-fit font-roboto text-black">
		{fakeViews[0].chats[0].messages[0].content}
	</div>
);

//{fakeViews[0].chats[0].messages[0].content}
