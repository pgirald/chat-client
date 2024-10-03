import { ReactNode, useContext } from "react";
import { Header, Info, Separator, WindowTemplate } from "./Styling";
import { IconType } from "react-icons";
import { BsFillQuestionCircleFill } from "react-icons/bs";
import { languageContext } from "../global/Language";
import Switch from "react-switch";
import { userContext } from "../global/User";
import { useGuardChanges } from "./UseGuardChanges";
import { SettingsUI } from "../Chore/Types";
import { GuardChangesButtons } from "./GuardChangesButtons";
import { fixedTheme, themeContext } from "../global/Theme";

export function SettingsForm() {
	const user = useContext(userContext);
	const language = useContext(languageContext);
	const theme = useContext(themeContext);

	const [settings, setSettings, discard, newChanges] =
		useGuardChanges<SettingsUI>({
			chatApproval: true,
			discoverability: true,
			enableNotifications: true,
			seenStatus: true,
			showOnlineStatus: true,
			notificationTone: { id: 0, name: "Some notification tone", url: "" },
			groupsTone: { id: 0, name: "Some groups tone", url: "" },
		});

	return (
		<WindowTemplate header={language.settings} wrapperClassName="space-y-5">
			<div className="flex-row h-52">
				<div className="justify-between">
					<Setting
						header={language.enableNotifications}
						content={
							<SettingSwitch
								onChange={(checked) => {
									setSettings({ ...settings, enableNotifications: checked });
								}}
								checked={settings.enableNotifications}
							/>
						}
					/>
					<Setting
						header={language.seenStatus}
						content={
							<SettingSwitch
								onChange={(checked) => {
									setSettings({ ...settings, seenStatus: checked });
								}}
								checked={settings.seenStatus}
							/>
						}
					/>
					<Setting
						header={language.showOnlineStatus}
						content={
							<SettingSwitch
								onChange={(checked) => {
									setSettings({ ...settings, showOnlineStatus: checked });
								}}
								checked={settings.showOnlineStatus}
							/>
						}
					/>
				</div>
				<Separator />
				<div className="justify-between">
					<Setting
						header={language.notificationTone}
						content={settings.notificationTone?.name}
					/>
					<Setting
						header={language.groupsTone}
						content={settings.groupsTone?.name}
					/>
					<Setting
						header={language.discoverability}
						content={
							<SettingSwitch
								onChange={(checked) => {
									setSettings({ ...settings, discoverability: checked });
								}}
								checked={settings.discoverability}
							/>
						}
					/>
				</div>
			</div>
			{newChanges && <GuardChangesButtons onDiscardRequested={discard} />}
		</WindowTemplate>
	);

	type SettingProps = {
		header: string;
		content: ReactNode;
	};

	function Setting(props: SettingProps) {
		return (
			<Info
				header={props.header}
				content={props.content}
				headerRight={<BsFillQuestionCircleFill color={theme.content} />}
			/>
		);
	}
}

type SettingSwitch = {
	checked: boolean;
	onChange: (checked: boolean) => void;
};

function SettingSwitch(props: SettingSwitch) {
	return (
		<Switch
			className="mt-1"
			onChange={props.onChange}
			checked={props.checked}
			onColor={fixedTheme.logoBlue}
			offColor={fixedTheme.elementGray}
		/>
	);
}
