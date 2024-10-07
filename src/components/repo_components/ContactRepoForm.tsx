import { ForwardedRef, forwardRef, useContext, useState } from "react";
import { UserUI } from "../../Chore/Types";
import { Modal, ModalHandler } from "../reusables/Modal";
import { fixedTheme, themeContext } from "../../global/Theme";
import profileImg from "../../assets/profile.png";
import { languageContext } from "../../global/Language";
import { userContext } from "../../global/User";
import { EditableImg } from "../reusables/EditableImg";
import { AppButton } from "../app_style/AppButton";
import { useGuardChanges } from "../../utils/react/hooks/UseGuardChanges";
import { GuardChangesButtons } from "../reusables/GuardChangesButtons";
import { MultilineInput } from "../../utils/react/components/MultilineInput";
import { AppInput } from "../app_style/AppInput";
import { WindowTemplate } from "../app_style/Template";
import { Separator } from "../app_style/Separator";
import { Info } from "../app_style/Info";

export type ContactFormProps = { contact: UserUI };

export function ContactForm(props: ContactFormProps) {
	const theme = useContext(themeContext);
	const language = useContext(languageContext);
	const user = useContext(userContext);

	const [contact, setContact, discard, newChanges] = useGuardChanges(
		props.contact
	);

	const imgSize = 80;
	const isCurrentUser = user.id === props.contact.id;

	return (
		<WindowTemplate
			wrapperClassName="space-y-5"
			header={props.contact.username}
		>
			<div className="flex-row items-end h-64">
				<div className="space-y-1">
					{!isCurrentUser && (
						<AppButton
							style={{ backgroundColor: fixedTheme.red }}
							content={language.block}
						/>
					)}
					{!isCurrentUser && (
						<AppButton
							style={{ backgroundColor: fixedTheme.mute }}
							content={language.mute}
						/>
					)}
					<div
						className="rounded-md space-y-2 w-fit h-fit items-center p-1"
						style={{ backgroundColor: theme.breaker }}
					>
						<EditableImg
							src={props.contact.img || profileImg}
							size={80}
							canChange={isCurrentUser}
						/>
						<MultilineInput
							className="rounded-md font-Roboto text-xs w-32 h-16 overflow-y-scroll"
							style={{
								backgroundColor: theme.bg,
								color: theme.content,
								fontStretch: "condensed",
							}}
							onChange={(value) => {
								setContact({ ...contact, aboutMe: value });
							}}
							value={contact.aboutMe}
							readonly={!isCurrentUser}
						/>
					</div>
				</div>
				<Separator />
				<div className="justify-between h-full">
					<Info
						header={language.firstName}
						content={
							<AppInput
								className="text-xs italic"
								onChange={(value) => {
									setContact({ ...contact, firstName: value });
								}}
								value={contact.firstName}
								active={isCurrentUser}
								showEdit={isCurrentUser}
							/>
						}
					/>
					<Info
						header={language.lastName}
						content={
							<AppInput
								className="text-xs italic"
								onChange={(value) => {
									setContact({ ...contact, lastName: value });
								}}
								value={contact.lastName}
								active={isCurrentUser}
								showEdit={isCurrentUser}
							/>
						}
					/>
					<Info
						header={language.username}
						content={
							<AppInput
								className="text-xs italic"
								onChange={(value) => {
									setContact({ ...contact, username: value });
								}}
								value={contact.username}
								active={isCurrentUser}
								showEdit={isCurrentUser}
							/>
						}
					/>
					<Info
						header={language.email}
						content={
							<AppInput
								className="text-xs italic"
								onChange={(value) => {
									setContact({ ...contact, email: value });
								}}
								value={contact.email}
								active={isCurrentUser}
								showEdit={isCurrentUser}
							/>
						}
					/>
					<Info
						header={language.phone}
						content={
							<AppInput
								className="text-xs italic"
								onChange={(value) => {
									setContact({ ...contact, phoneNumber: value });
								}}
								value={contact.phoneNumber}
								placeholder={contact.phoneNumber || language.notSpecified}
								active={isCurrentUser}
								showEdit={isCurrentUser}
							/>
						}
					/>
				</div>
			</div>
			{newChanges && (
				<GuardChangesButtons
					onDiscardRequested={discard}
					onConfirmRequested={() => {
						alert("Confirmed");
					}}
				/>
			)}
		</WindowTemplate>
	);
}
