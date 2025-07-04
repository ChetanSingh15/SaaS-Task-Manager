import { getWorkspaceProjectsBYWorkspaceId } from "@/app/data/project/get-workspace-projects";
import { getuserById } from "@/app/data/user/get-user";
import { $Enums, User } from "@/lib/generated/prisma";
import { AppSidebar } from "./app-sidebar";
import { ProjectProps, WorkspaceMembersProps } from "@/utils/types";

export interface AppSidebarDataProps extends User {
  workspaces: {
    id: string;
    name: string;
    createdAt: Date;
    userId: string;
    workspaceId: string;
    acessLevel: $Enums.AccessLevel;
    workspace: {
      name: string;
    };
  }[];
}

export const AppSidebarContainer = async ({data,workspaceId}:{data: AppSidebarDataProps, workspaceId: string}) => {
    const {projects,workspaceMembers} = await getWorkspaceProjectsBYWorkspaceId(workspaceId);
    const user = await getuserById();

    return <AppSidebar
    data={data}
    projects={projects as unknown as ProjectProps[]}
    workspaceMembers = {workspaceMembers as unknown as WorkspaceMembersProps[]}
    user = {user as User} 
    />
}