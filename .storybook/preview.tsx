import type { Preview } from "@storybook/react";
import { globalContext } from "../src/tests/src/Context";
import React from "react";

const preview: Preview = {
	decorators: [
		(Story) => {
			return (
				<globalContext.ContextNode>
					<Story />
				</globalContext.ContextNode>
			);
		},
	],
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
	},
};

export default preview;
