import { db } from "@/lib/db";
import { userRequired } from "../user/is-User-Authenticated";


export const getWorkspaceById = async (workspaceId: string) => {
  const { user } = await userRequired();

  const isUserMember = await db.workspaceMember.findUnique({
    where: {
      userId_workspaceId: {
        userId: user?.id as string,
        workspaceId,
      },
    },
  });

  if (!isUserMember) {
    throw new Error("Unauthorized access");
  }

  const workspace = await db.workspace.findUnique({
    where: { id: workspaceId },
    include: {
      members: { select: { userId: true, acessLevel: true } },
    },
  });

  return { data: workspace };
};