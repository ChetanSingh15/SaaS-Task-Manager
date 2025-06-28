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
};

export const postComment = async (
  workspaceId: string,
  projectId: string,
  content: string
) => {
  const { user } = await userRequired();

  const isMember = await db.workspaceMember.findUnique({
    where: {
      userId_workspaceId: {
        userId: user?.id as string,
        workspaceId,
      },
    },
  });

  if (!isMember) {
    throw new Error("You are not a member of this workspace");
  }

  const projectAccess = await db.projectAccess.findUnique({
    where: {
      workspaceMemberId_projectId: {
        workspaceMemberId: isMember.id,
        projectId,
      },
    },
  });

  if (!projectAccess) {
    throw new Error("You do not have access to this project");
  }

  const comment = await db.comment.create({
    data: {
      content,
      projectId,
      userId: user?.id as string,
    },
  });

  return comment;
};