import { createContext, ReactNode, useContext, useState } from "react";

export const LoadingContext = createContext<
	[(loading: boolean) => void, boolean]
>([(_: boolean) => {}, false]);

export function LoadingModal({
	visible,
	children,
}: {
	visible: boolean;
	children: ReactNode;
}) {
	const [loading, setLoading] = useState(false);
	return (
		<LoadingContext.Provider value={[setLoading, loading]}>
			{children}
			<div
				className={`${
					visible ? "visible" : "invisible"
				} fixed bg-[#00000050] h-full w-full justify-center items-center text-white`}
			>
				Loading
			</div>
		</LoadingContext.Provider>
	);
}

export function useLoading() {
	return useContext(LoadingContext);
}
