import { ReactNode, useContext, useRef } from "react";
import { IconType } from "react-icons";
import { BsFillQuestionCircleFill } from "react-icons/bs";
import { languageContext } from "../../global/Language";
import Switch from "react-switch";
import { useGuardChanges } from "../../utils/react/hooks/UseGuardChanges";
import { SettingsUI } from "../../Chore/Types";
import { GuardChangesButtons } from "../reusables/GuardChangesButtons";
import { fixedTheme, themeContext } from "../../global/Theme";
import { WindowTemplate } from "../app_style/Template";
import { Separator } from "../app_style/Separator";
import { Info } from "../app_style/Info";

export function SettingsForm() {
	const language = useContext(languageContext);
	const theme = useContext(themeContext);
	const defaultSettingsRef = useRef<SettingsUI>({
		chatApproval: true,
		discoverability: true,
		enableNotifications: true,
		seenStatus: true,
		showOnlineStatus: true,
		notificationTone: { id: 0, name: "Some notification tone", url: "" },
		groupsTone: { id: 0, name: "Some groups tone", url: "" },
	});

	const [settings, setSettings, discard, newChanges] =
		useGuardChanges<SettingsUI>(defaultSettingsRef.current);

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
