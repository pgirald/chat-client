import { useContext } from "react";
import { Info, WindowTemplate } from "./Styling";
import { languageContext } from "../global/Language";
import { AppButton } from "./AppButton";
import { fixedTheme } from "../global/Theme";
import { userContext } from "../global/User";

export function PrivilegesForm() {
	const language = useContext(languageContext);
	const user = useContext(userContext);

	return (
		<WindowTemplate header={language.privileges} wrapperClassName="space-y-5">
			{user.role?.defaults && (
				<>
					<Info header={language.defaultTheme} content="Light" />

					<Info
						header={language.defaultNotificationRingtone}
						content="Some awesome tone"
					/>
				</>
			)}
			{(user.role?.userPrivileges || user.role?.userDeletionBan) && (
				<AppButton
					style={{ backgroundColor: fixedTheme.logoBlue }}
					content={language.manageUsers}
				/>
			)}
			{user.role?.broadcast && (
				<AppButton
					style={{ backgroundColor: fixedTheme.logoBlue }}
					content={language.broadcast}
				/>
			)}
		</WindowTemplate>
	);
}
