import { english, Language, languageContext } from "../../global/Language";
import { userContext } from "../../global/User";
import { light, Theme, themeContext } from "../../global/Theme";
import { render } from "@testing-library/react";
import { fakeViews } from "./Mocks";
import { ReactNode } from "react";

export const globalContext = Context(light, english, 1);

export function Context(theme: Theme, language: Language, userIdx: number) {
	const ContextNode = ({ children }: { children: ReactNode }) => (
		<themeContext.Provider value={theme}>
			<languageContext.Provider value={language}>
				<userContext.Provider
					value={{
						...fakeViews[userIdx].user,
						blocked: false,
						muted: false,
						connected: false,
					}}
				>
					{children}
				</userContext.Provider>
			</languageContext.Provider>
		</themeContext.Provider>
	);
	return {
		renderWithContext(ui: ReactNode) {
			return render(<ContextNode>{ui}</ContextNode>);
		},
		get ContextNode() {
			return ContextNode;
		},
		get user() {
			return fakeViews[userIdx].user;
		},
		get chats() {
			return fakeViews[userIdx].chats;
		},
		get language() {
			return language;
		},
	};
}
