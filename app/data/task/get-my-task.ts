import { db } from "@/lib/db";
import { userRequired } from "../user/is-User-Authenticated";

export const getMyTasks = async () => {
  const { user } = await userRequired();

  const tasks = await db.task.findMany({
    where: {
      assignedId: user?.id,
    },
    include: {
      project: { select: { name: true, id: true, workspaceId: true } },
      attachments: { select: { name: true, id: true } },
    },
  });

  return tasks;
};