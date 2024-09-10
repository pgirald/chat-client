import { createContext } from "react";

export type Theme = {
	homeBg1: string;
	homeBg2: string;
	breaker: string;
	bg: string;
	content: string;
	separator: string;
};

export const light: Theme = {
	homeBg1: "#2476BA",
	homeBg2: "#28AEDB",
	breaker: "#092535",
	bg: "#FFFFFF",
	content: "#000000",
	separator: "#7E7E7E",
};

export const dark: Theme = {
	homeBg1: "#000000",
	homeBg2: "#000000",
	breaker: "#743ABF",
	bg: "#000000",
	content: "#FFFFFF",
	separator: "#5A5A5A",
};

export const fixedTheme = {
	logoOrange: "#EA5421",
	logoBlue: "#2F8DCA",
	white: "#FFFFFF",
	green: "#55FF52",
	red: "#BA0000",
	elementGray: "#D9D9D9",
};

export const themeContext = createContext(light);
