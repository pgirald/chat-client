import { Meta, StoryObj } from "@storybook/react/*";
import "../index.css";
import { globalContext } from "../../tests/src/Context";
import { RoleForm } from "../../components/repo_components/RoleRepoForm";

const meta: Meta<typeof RoleForm> = { component: RoleForm };

export default meta;

export const ShowingRole: StoryObj<typeof RoleForm> = {
	args: { contact: globalContext.chats[0].subs[0] 
        
    },
};