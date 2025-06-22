"use server";

import { createWorkspaceDataType } from "@/components/workspace/create-workspace-form";
import { userRequired } from "../data/user/is-User-Authenticated";
import { workspaceSchema } from "@/lib/schema";
import { db } from "@/lib/db";
import { generateInviteCode } from "@/utils/get-inviteCode";

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
}