"use server";

import { createWorkspaceDataType } from "@/components/workspace/create-workspace-form";
import { userRequired } from "../data/user/is-User-Authenticated";
import { workspaceSchema } from "@/lib/schema";
import { db } from "@/lib/db";
import { generateInviteCode } from "@/utils/get-inviteCode";
import { redirect } from "next/navigation";
import { AccessLevel } from "@/lib/generated/prisma";

export const createNewWorkspace = async (data: createWorkspaceDataType) => {
    try {
        const {user} = await userRequired()

        const validateData = workspaceSchema.parse(data)

        const res  = await db.workspace.create({
            data: {
                name: validateData.name,
                description: validateData.description,
                ownerId: user?.id,
                inviteCode: generateInviteCode(),
                members: {
                    create: {
                        userId: user?.id as string,
                        acessLevel: "OWNER",
                    }
                }
            }
        })
        return {data: res};
    } catch (error) {
        console.log(error);
        return {
            status: 500,
            message: "An error occured while creating the workspace",
        }
    }
};

export const updateWorkspace = async (
  workspaceId: string,
  data: createWorkspaceDataType
) => {
  const { user } = await userRequired();

  const validatedData = workspaceSchema.parse(data);

  const isUserAMember = await db.workspaceMember.findUnique({
    where: {
      userId_workspaceId: {
        userId: user?.id as string, 
        workspaceId: workspaceId,
      },
    },
  });

  if (!isUserAMember) {
    throw new Error("You are not a member of this workspace.");
  }

  await db.workspace.update({
    where: { id: workspaceId },
    data: {
      name: validatedData.name,
      description: validatedData.description || "",
    },
  });

  return { success: true };
};

export const resetWorkspaceInviteCode = async (workspaceId: string) => {
  const { user } = await userRequired();

  const isUserAMember = await db.workspaceMember.findUnique({
    where: {
      userId_workspaceId: {
        userId: user?.id as string,
        workspaceId: workspaceId,
      },
    },
  });

  if (!isUserAMember) {
    throw new Error("You are not a member of this workspace.");
  }

  await db.workspace.update({
    where: { id: workspaceId },
    data: {
      inviteCode: generateInviteCode(),
    },
  });
};

export const deleteWorkspace = async (workspaceId: string) => {
  const { user } = await userRequired();

  const isUserAMember = await db.workspaceMember.findUnique({
    where: {
      userId_workspaceId: {
        userId: user?.id as string,
        workspaceId: workspaceId,
      },
    },
  });

  if (!isUserAMember) {
    throw new Error("You are not a member of this workspace.");
  }

  if (isUserAMember && isUserAMember.acessLevel !== AccessLevel.OWNER) {
    throw new Error("Only the owner can delete a workspace.");
  }

  await db.workspace.delete({
    where: { id: workspaceId },
  });

  redirect("/workspace");
};