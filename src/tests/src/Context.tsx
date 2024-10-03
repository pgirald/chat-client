import {
	english,
	Language,
	LanguageContext,
	languageContext,
	spanish,
} from "../../global/Language";
import { userContext } from "../../global/User";
import {
	dark,
	light,
	Theme,
	ThemeContext,
	themeContext,
} from "../../global/Theme";
import { render } from "@testing-library/react";
import { fakeViews } from "./Mocks";
import { ReactNode, useState } from "react";
import { object } from "prop-types";

export const globalContext = Context(light, english, 1);

export function Context(theme: Theme, language: Language, userIdx: number) {
	const ContextNode = ({ children }: { children: ReactNode }) => {
		const [_theme, setTheme] = useState<ThemeContext>(theme);

		const [_language, setLanguage] = useState<LanguageContext>(language);

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
			<themeContext.Provider value={_theme}>
				<languageContext.Provider value={_language}>
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
