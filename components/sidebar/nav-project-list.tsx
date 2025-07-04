"use client"

import { ProjectProps, WorkspaceMembersProps } from "@/utils/types"
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "../ui/sidebar";
import { usePathname } from "next/navigation";
import { CreateProjectForm } from "../project/create-project-form";

export const NavProjects = ({projects, workspaceMembers}:{
    projects: ProjectProps[];
    workspaceMembers: WorkspaceMembersProps[];
}) => {
    const {isMobile,setOpenMobile} = useSidebar()
    const pathname = usePathname()
    return <>
        <SidebarGroup className="group-data-[collapsible=icon]:hidden"> 
            <SidebarGroupLabel className="flex justify-between">
                <span className="text-sm font-semibold text-muted-foreground uppercase">
                    Projects
                </span>
                <CreateProjectForm workspaceMembers={workspaceMembers} />
            </SidebarGroupLabel>
            <SidebarMenu>
                {
                    projects.map((project) => {
                        const href=`/workspace/${project.workspaceId}/projects/${project.id}`
                       return (<SidebarMenuItem key={project?.id}>
                        <SidebarMenuButton>
                            <a 
                            href={href}
                            className={
                                pathname === href ? "text-blue-500 font-semibold" 
                                : "text-muted-foreground"
                            }
                            >
                                {project?.name}
                            </a>
                        </SidebarMenuButton>
                        </SidebarMenuItem>
                    )})
                }
            </SidebarMenu>
        </SidebarGroup>
    </>
}