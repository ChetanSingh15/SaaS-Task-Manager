"use server";

import { ProjectDataType } from "@/components/project/create-project-form";
import { userRequired } from "../data/user/is-User-Authenticated";
import { db } from "@/lib/db";
import { projectSchema } from "@/lib/schema";

export const createNewProject = async (data: ProjectDataType) => {
    const {user} = await userRequired()

    const workspace =  await db.workspace.findUnique({
        where:{id:data?.workspaceId},
        include: {
            projects: {select: {id: true}}
        }
    });

    const validatedData = projectSchema.parse(data);

    const workspaceMembers = await db.workspaceMember.findMany({
        where: {
            workspaceId: data.workspaceId,
        }
    })

    const isUserMember = workspaceMembers.some((member) => member.userId === user?.id)
    if(!isUserMember) {
        throw new Error("Unauthorized to create project in this workspace.")
    }

    if(validatedData.memberAccess?.length === 0){
        validatedData.memberAccess = [user?.id as string];
    }else if(!validatedData.memberAccess?.includes(user?.id as string)){
        validatedData.memberAccess?.push(user?.id as string);
    }

    await db.project.create({
        data: {
            name: validatedData.name,
            description: validatedData.description || "",
            workspaceId: validatedData.workspaceId,
            projectAccess: {
                create: validatedData.memberAccess?.map((memberId) => ({
                    workspaceMemberId: workspaceMembers.find((member) => member?.userId === memberId)?.id!,
                    hasAccess: true
                }))
            },
            activities: {
                create: {
                    type: "PROJECT_CREATED",
                    description: `created project ${validatedData.name}`,
                    userId: user?.id as string, 
                }
            }

        }
    })


    return {success: true};
}