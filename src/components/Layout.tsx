import { ReactNode, useContext, useRef } from "react";
import { dark, fixedTheme, light, themeContext } from "../global/Theme";
import { Logo } from "./Styling";
import { BsGearWide } from "react-icons/bs";
import { BsTranslate } from "react-icons/bs";
import { BsFillInfoCircleFill } from "react-icons/bs";
import { BsChatDotsFill } from "react-icons/bs";
import { BsSunFill } from "react-icons/bs";
import { BsFillMoonFill } from "react-icons/bs";
import { RxTriangleDown } from "react-icons/rx";
import { english, languageContext, spanish } from "../global/Language";
import profileImg from "../assets/profile.png";
import { userContext } from "../global/User";
import { Modal, ModalHandler } from "./Modal";
import { SettingsForm } from "./SettingsForm";
import { EditableImg } from "./EditableImg";
import { PrivilegesForm } from "./PrivilegesForm";
import { IconType } from "react-icons";
import { BsPersonCircle } from "react-icons/bs";
import { BsFillKeyFill } from "react-icons/bs";
import { BsBoxArrowLeft } from "react-icons/bs";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ContactForm } from "./ContactForm";

export type LayoutProps = {
	children: ReactNode;
};

export const layoutPaddings = { left: 50, right: 10 };

export function Layout(props: LayoutProps) {
	const user = useContext(userContext);
	const theme = useContext(themeContext);
	const language = useContext(languageContext);

	const settingsModalRef = useRef<ModalHandler>(null);
	const privilegesModalRef = useRef<ModalHandler>(null);
	const userModalRef = useRef<ModalHandler>(null);

	const menuItemClass = "dropdownMenuItem";

	const userOps = (
		<DropdownMenu.Content
			className="border space-y-2 rounded-md p-1 mt-1 z-50"
			style={{ borderColor: theme.separator, backgroundColor: theme.bg }}
			side="bottom"
			align="end"
		>
			<DropdownMenu.Item
				className={menuItemClass}
				key="0"
				onClick={() => {
					userModalRef.current?.openModal();
				}}
			>
				<BsPersonCircle size={30} className="pr-2" />
				{language.profile}
			</DropdownMenu.Item>
			{user.role && (
				<DropdownMenu.Item
					className={menuItemClass}
					key="1"
					onClick={() => {
						privilegesModalRef.current?.openModal();
					}}
				>
					<BsFillKeyFill size={30} className="pr-2" />
					{language.admon}
				</DropdownMenu.Item>
			)}
			<DropdownMenu.Item className={menuItemClass} key="2">
				<BsBoxArrowLeft size={30} className="pr-2" />
				{language.logOut}
			</DropdownMenu.Item>
		</DropdownMenu.Content>
	);

	const languages = (
		<DropdownMenu.Content
			className="border space-y-2 rounded-md p-1 mt-1 z-50 outline-none"
			style={{ borderColor: theme.separator, backgroundColor: theme.bg }}
			side="bottom"
			align="start"
		>
			<DropdownMenu.Item
				className={menuItemClass}
				key="0"
				onClick={() => {
					language.set?.(spanish);
				}}
			>
				{language.spanish}
			</DropdownMenu.Item>
			<DropdownMenu.Item
				className={menuItemClass}
				key="1"
				onClick={() => {
					language.set?.(english);
				}}
			>
				{language.english}
			</DropdownMenu.Item>
		</DropdownMenu.Content>
	);

	return (
		<div className="h-full w-full">
			<style>
				{`.dropdownMenuItem {
				flex-direction: row;
				cursor: pointer;
				align-items: center;
				outline: none;
				border-radius: 6px;
				padding-left: 4px;
				padding-right: 4px;
				color: ${theme.content}
				}

				.dropdownMenuItem:hover {
				background-color: ${fixedTheme.selectedItem};
				color: white;
				}`}
			</style>
			<div
				className="flex-row w-full h-[6%] pt-1"
				style={{
					backgroundColor: theme.bg,
					paddingLeft: layoutPaddings.left,
					paddingRight: layoutPaddings.right,
				}}
			>
				<Logo className="w-1/6" showIcon />
				<div className="flex-row w-5/6 justify-center items-center">
					<div
						className="flex-row items-center justify-center space-x-8 w-5/6"
						style={{ color: theme.content }}
					>
						<Option
							label={language.settings}
							icon={<BsGearWide />}
							onClick={() => {
								settingsModalRef.current?.openModal();
							}}
						/>
						<DropdownMenu.Root>
							<DropdownMenu.Trigger className="outline-none">
								<Option label={language.language} icon={<BsTranslate />} />
							</DropdownMenu.Trigger>
							{languages}
						</DropdownMenu.Root>
						<Option label={language.about} icon={<BsFillInfoCircleFill />} />
						<Option label={language.chats} icon={<BsChatDotsFill />} />
						<DropdownMenu.Root>
							<DropdownMenu.Trigger className="outline-none">
								<UserOps src={user.img} />
							</DropdownMenu.Trigger>
							{userOps}
						</DropdownMenu.Root>
					</div>
					<div className="w-1/6 items-end">
						{theme === light ? (
							<BsSunFill
								className="cursor-pointer"
								color={theme.content}
								size={20}
								onClick={() => {
									theme.set?.(dark);
								}}
							/>
						) : (
							<BsFillMoonFill
								className="cursor-pointer"
								color={theme.content}
								size={20}
								onClick={() => {
									theme.set?.(light);
								}}
							/>
						)}
					</div>
				</div>
			</div>
			<div className="h-[94%]">{props.children}</div>
			<Modal ref={settingsModalRef}>
				<SettingsForm />
			</Modal>
			<Modal ref={privilegesModalRef}>
				<PrivilegesForm />
			</Modal>
			<Modal ref={userModalRef}>
				<ContactForm contact={user} />
			</Modal>
		</div>
	);
}

type OptionProps = { onClick?: () => void; icon?: ReactNode; label?: string };

function Option(props: OptionProps) {
	return (
		<div
			onClick={props.onClick}
			className="cursor-pointer flex-row space-x-1 font-Roboto font-bold text-sm items-center"
		>
			{props.icon}
			{props.label}
		</div>
	);
}

type UserOpsProps = { onClick?: () => void; src?: string };

function UserOps(props: UserOpsProps) {
	const imgSize = 30;

	return (
		<div
			onClick={props.onClick}
			className="flex-row p-[2px] rounded-full h-fit w-fit cursor-pointer"
			style={{ backgroundColor: fixedTheme.logoBlue }}
		>
			<div
				className="w-6 items-center justify-center"
				style={{ height: imgSize }}
			>
				<RxTriangleDown color="white" size={25} />
			</div>
			<EditableImg src={props.src || profileImg} size={imgSize} />
		</div>
	);
}
