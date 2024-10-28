import { useContext, useRef } from "react";
import { ContactUI } from "../../Chore/Types";
import { fixedTheme, themeContext } from "../../global/Theme";
import profileImg from "../../assets/profile.png";
import { languageContext } from "../../global/Language";
import { EditableImg } from "../reusables/EditableImg";
import { AppButton } from "../app_style/AppButton";
import { useGuardChanges } from "../../utils/react/hooks/UseGuardChanges";
import { GuardChangesButtons } from "../reusables/GuardChangesButtons";
import { MultilineInput } from "../../utils/react/components/MultilineInput";
import { AppInput } from "../app_style/AppInput";
import { WindowTemplate } from "../app_style/Template";
import { Separator } from "../app_style/Separator";
import { Info } from "../app_style/Info";
import { useUser } from "../../global/User";
import { useChatsStore } from "../../global/Chats";
import { usePromiseAwaiter } from "../../global/Loading";
import { sourceContext } from "../../global/Source";

export type ContactFormProps = {
	contact: ContactUI;
};

export function ContactForm(props: ContactFormProps) {
	const theme = useContext(themeContext);
	const language = useContext(languageContext);
	const user = useUser();
	const source = useContext(sourceContext);

	const initialContactRef = useRef<ContactUI>(props.contact);

	const updateContactDependents = useChatsStore(
		(store) => store.updateContactDependents
	);

	const updateOwnerAwaiter = usePromiseAwaiter(
		(controller?, params?: { owner: ContactUI }) =>
			source.updateMyInfo(params!.owner, controller),
		true
	);

	const [contact, setContact, discard, newChanges] = useGuardChanges(
		initialContactRef.current
	);

	const isCurrentUser = user.id === props.contact.id;

	return (
		<WindowTemplate wrapperClassName="space-y-5" header={contact.username}>
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
							src={contact.img || profileImg}
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
					onConfirmRequested={async () => {
						const updatedOwner = await updateOwnerAwaiter({ owner: contact });
						if (updatedOwner) {
							updateContactDependents(updatedOwner);
							initialContactRef.current = updatedOwner;
						}
					}}
				/>
			)}
		</WindowTemplate>
	);
}
