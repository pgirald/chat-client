import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { io } from "socket.io-client";
import "./index.css";
import { globalContext } from "./tests/src/Context";

const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement
);
root.render(
	<React.StrictMode>
		<globalContext.ContextNode>
			<App />
		</globalContext.ContextNode>
	</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// customElements.define(
// 	"my-component",
// 	class MyComponent extends HTMLElement {
// 		// This method runs when your custom element is added to the page
// 		connectedCallback() {
// 			const root = this.attachShadow({ mode: "closed" });
// 			root.innerHTML = "";
// 		}
// 	}
// );
