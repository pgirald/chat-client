import { useContext, useRef } from "react";
import { Info, WindowTemplate } from "./Styling";
import { languageContext } from "../global/Language";
import { AppButton } from "./AppButton";
import { fixedTheme } from "../global/Theme";
import { userContext } from "../global/User";
import { Modal, ModalHandler } from "./Modal";

export function PrivilegesForm() {
	const language = useContext(languageContext);
	const user = useContext(userContext);

	const roleModalRef = useRef<ModalHandler>(null);

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
			{user.role?.userPrivileges && (
				<AppButton
					style={{ backgroundColor: fixedTheme.logoBlue }}
					onClick={()=>{roleModalRef.current?.openModal()}}
					content={language.manageRoles}
				/>
			)}
			<Modal ref={roleModalRef}>
				<PrivilegesForm />
			</Modal>
		</WindowTemplate>
	);
}
