import { useContext } from "react";
import { AppButton } from "../app_style/AppButton";
import { languageContext } from "../../global/Language";
import { fixedTheme } from "../../global/Theme";

export type GuardChangesButtonsProps = {
	onDiscardRequested?: () => void;
	onConfirmRequested?: () => void;
};

export function GuardChangesButtons(props: GuardChangesButtonsProps) {
	const language = useContext(languageContext);

	return (
		<div className="flex-row space-x-2 self-end">
			<AppButton
				style={{ backgroundColor: fixedTheme.logoOrange }}
				content={language.discard}
				onClick={props.onDiscardRequested}
			/>
			<AppButton
				style={{ backgroundColor: fixedTheme.logoBlue }}
				content={language.confirm}
				onClick={props.onConfirmRequested}
			/>
		</div>
	);
}
