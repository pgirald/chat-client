import { useContext, useEffect, useState } from "react";
import { WindowTemplate } from "./Styling";
import { languageContext } from "../global/Language";
import { ContactUI, RoleUI } from "../Chore/Types";
import { useGuardChanges } from "./UseGuardChanges";
import { AppButton } from "./AppButton";
import { fixedTheme } from "../global/Theme";
import { GuardChangesButtons } from "./GuardChangesButtons";

export type RoleFormProps = {
	contact: ContactUI;
};

export function RoleForm(props: RoleFormProps) {
	const language = useContext(languageContext);
	const [permissions, setPermissions, discard, newChanges] =
		useGuardChanges<RoleUI>(
			props.contact.role || {
				id: -1,
				broadcast: false,
				defaults: false,
				name: "new",
				userDeletionBan: false,
				userPrivileges: false,
			}
		);

	return (
		<WindowTemplate
			header={props.contact.username}
			wrapperClassName="space-y-5"
		>
			<div>
				{permissions.userPrivileges && <Privileges />}
				{permissions.userDeletionBan && <RestrictionButtons />}
			</div>
			{newChanges && <GuardChangesButtons onDiscardRequested={discard} />}
		</WindowTemplate>
	);

	function Privileges() {
		return (
			<div className="flex-row h-16 space-x-3">
				<div className="h-full justify-between">
					<Privilege
						checked={permissions.defaults}
						label={language.defaults}
						onChange={(value) =>
							setPermissions({ ...permissions, defaults: value })
						}
					/>
					<Privilege
						checked={permissions.userDeletionBan}
						label={language.userDeletionBan}
						onChange={(value) =>
							setPermissions({ ...permissions, userDeletionBan: value })
						}
					/>
				</div>
				<div className="h-full justify-between">
					<Privilege
						checked={permissions.broadcast}
						label={language.broadcast}
						onChange={(value) =>
							setPermissions({ ...permissions, broadcast: value })
						}
					/>
					<Privilege
						checked={permissions.userPrivileges}
						label={language.userPrivileges}
						onChange={(value) =>
							setPermissions({ ...permissions, userPrivileges: value })
						}
					/>
				</div>
			</div>
		);
	}

	function RestrictionButtons() {
		return (
			<div className="flex-row space-x-2">
				<AppButton
					className="w-1/2"
					style={{ backgroundColor: fixedTheme.mute }}
					content={language.ban}
				/>
				<AppButton
					className="w-1/2"
					style={{ backgroundColor: fixedTheme.red }}
					content={language.delete}
				/>
			</div>
		);
	}
}

type PrivilegeProps = {
	checked?: boolean;
	label?: string;
	onChange?: (value: boolean) => void;
};

function Privilege(props: PrivilegeProps) {
	const [checked, setChecked] = useState(props.checked || false);

	useEffect(() => {
		setChecked(props.checked || false);
	}, [props.checked]);

	return (
		<div className="flex-row space-x-1">
			<input
				type="checkbox"
				onChange={() => {
					setChecked(!checked);
					props.onChange?.(!checked);
				}}
				checked={checked}
			/>
			<span>{props.label}</span>
		</div>
	);
}
