import { ForwardedRef, forwardRef, useContext } from "react";
import { UserUI } from "../Chore/Types";
import { Modal, ModalHandler } from "./Modal";
import { Info, Separator, WindowTemplate } from "./Styling";
import { fixedTheme, themeContext } from "../global/Theme";
import profileImg from "../assets/profile.png";
import { languageContext } from "../global/Language";
import { userContext } from "../global/User";
import { removeScrollBars } from "../utils/components/DefaultStyles";

export type ContactFormProps = { contact: UserUI };

export function ContactForm(props: ContactFormProps) {
	const theme = useContext(themeContext);
	const language = useContext(languageContext);
	const user = useContext(userContext);

	const imgSize = 80;
	const isCurrentUser = user.id === props.contact.id;

	return (
		<WindowTemplate header={props.contact.username}>
			<div className="flex-row items-end space-x-5 h-60">
				<div className="space-y-1">
					{!isCurrentUser && (
						<div
							className="cursor-pointer p-1 rounded-md font-Roboto text-white font-bold text-sm items-center"
							style={{ backgroundColor: fixedTheme.red }}
						>
							{language.block}
						</div>
					)}
					{!isCurrentUser && (
						<div
							className="cursor-pointer p-1 rounded-md font-Roboto text-white font-bold text-sm items-center"
							style={{ backgroundColor: fixedTheme.mute }}
						>
							{language.mute}
						</div>
					)}
					<div
						className="rounded-md space-y-2 w-fit h-fit items-center p-1"
						style={{ backgroundColor: theme.breaker }}
					>
						<img src={profileImg} width={imgSize} height={imgSize} />
						<div
							className="rounded-md font-Roboto text-sm w-28 h-20 overflow-y-scroll"
							style={{
								backgroundColor: theme.bg,
								fontStretch: "condensed",
								...removeScrollBars,
							}}
						>
							{props.contact.aboutMe}
						</div>
					</div>
				</div>
				<Separator />
				<div className="justify-between h-full">
					<Info
						header={language.fullName}
						content={`${props.contact.firstName} ${props.contact.lastName}`}
					/>
					<Info header={language.username} content={props.contact.username} />
					<Info header={language.email} content={props.contact.email} />
					<Info
						header={language.phone}
						content={props.contact.phoneNumber || language.notSpecified}
					/>
				</div>
			</div>
		</WindowTemplate>
	);
}
