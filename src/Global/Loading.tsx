import {
	createContext,
	ReactNode,
	useContext,
	useReducer,
	useRef,
	useState,
} from "react";
import { PulseLoader } from "react-spinners";
import { fixedTheme } from "./Theme";
import { AppButton } from "../components/app_style/AppButton";
import { Language } from "./Language";
import { empty, EventHandler } from "../utils/General";
import { EventHandler as TEventHandler } from "../utils/Types";

const LoadingContext = createContext<
	[
		(loading: boolean, cancel?: boolean) => void,
		boolean,
		TEventHandler<[], () => any>,
	]
>([(_: boolean, __?: boolean) => {}, false, null as any]);

export function GlobalLoading({
	children,
	language,
}: {
	children: ReactNode;
	language: Language;
}) {
	const [loading, _setLoading] = useState(false);
	const [showCancel, setShowCancel] = useState(false);
	const cancelSubsRef = useRef(EventHandler());

	function setLoading(loading: boolean, cancel?: boolean) {
		_setLoading(loading);
		if (!empty(cancel)) {
			setShowCancel(cancel!);
		}
	}

	return (
		<LoadingContext.Provider
			value={[setLoading, loading, cancelSubsRef.current]}
		>
			{children}
			{loading && (
				<div
					className={`fixed bg-[#00000050] h-[100vh] w-[100vw] justify-center items-center space-y-2 z-50`}
				>
					<PulseLoader color={fixedTheme.logoOrange} size={40} />
					{showCancel && (
						<AppButton
							content={language.cancel}
							style={{ backgroundColor: fixedTheme.logoBlue }}
							onClick={() => {
								cancelSubsRef.current.trigger();
							}}
						/>
					)}
				</div>
			)}
		</LoadingContext.Provider>
	);
}

export function usePromiseAwaiter<P extends object>(
	callback: (controller?: AbortController, params?: P) => Promise<any>,
	canceleable?: boolean
) {
	const [setLoading, _, cancelHandler] = useLoading();
	return async function (params?: P) {
		const controller = canceleable ? new AbortController() : undefined;
		let showCancel = canceleable;
		if (canceleable) {
			cancelHandler.add(abort);
		}
		setLoading(true, showCancel);
		const result = await callback(controller, params);
		if (!controller?.signal.aborted) {
			setLoading(false, false);
		}
		if (controller) {
			cancelHandler.remove(abort);
		}

		return result;

		function abort() {
			controller!.abort();
			setLoading(false, false);
		}
	};
}

export function useLoading() {
	return useContext(LoadingContext);
}
