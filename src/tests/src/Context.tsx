import {
	english,
	Language,
	LanguageContext,
	languageContext,
	spanish,
} from "../../global/Language";
import {
	dark,
	light,
	Theme,
	ThemeContext,
	themeContext,
} from "../../global/Theme";
import { render } from "@testing-library/react";
import { fakeViews, MockServer, MockSource } from "./Mocks";
import { ReactNode, useRef, useState } from "react";
import { object } from "prop-types";
import { sourceContext } from "../../global/Source";
import { GlobalLoading } from "../../global/Loading";
import { ChatsProvider } from "../../global/Chats";

export const globalContext = Context(light, english, 0);

export function Context(theme: Theme, language: Language, userIdx: number) {
	const ContextNode = ({ children }: { children: ReactNode }) => {
		const [_theme, setTheme] = useState<ThemeContext>(theme);

		const [_language, setLanguage] = useState<LanguageContext>(language);

		const sourceRef = useRef(MockServer());

		(sourceRef.current as MockSource)._authenticate(
			fakeViews[userIdx].user.email,
			""
		);

		const _setTheme = (value: Theme) => {
			if (value !== light && value !== dark) {
				throw Error("And invalid value of theme was specified");
			}
			Object.setPrototypeOf(value, { set: _setTheme });
			setTheme(value);
		};

		const _setLanguage = (value: Language) => {
			if (value !== spanish && value !== english) {
				throw Error("And invalid value of theme was specified");
			}
			Object.setPrototypeOf(value, { set: _setLanguage });
			setLanguage(value);
		};

		Object.setPrototypeOf(_theme, { set: _setTheme });
		Object.setPrototypeOf(_language, { set: _setLanguage });

		return (
			<sourceContext.Provider value={sourceRef.current}>
				<themeContext.Provider value={_theme}>
					<languageContext.Provider value={_language}>
						<ChatsProvider>
							<GlobalLoading language={_language}>{children}</GlobalLoading>
						</ChatsProvider>
					</languageContext.Provider>
				</themeContext.Provider>
			</sourceContext.Provider>
		);
	};
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
