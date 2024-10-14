import { PulseLoader } from "react-spinners";
import { fixedTheme } from "../../global/Theme";

export function ListLoader() {
	return (
		<div className="w-full items-center">
			<PulseLoader color={fixedTheme.logoBlue} />
		</div>
	);
}
