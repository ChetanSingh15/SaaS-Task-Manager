"use client";

import { DataTable } from "@/components/data-table";
import { columns, myTaskColumns } from "@/components/project/columns";
import { Project, Task, User } from "@/lib/generated/prisma";



export interface TaskProps extends Task {
  assignedTo: User;
  project: Project;
  attachments: File[];
}

export const ProjectTable = ({ tasks }: { tasks: TaskProps[] }) => {
  return <DataTable columns={columns} data={tasks as any} />;
};

export const MyTasksTable = ({ tasks }: { tasks: TaskProps[] }) => (
  <DataTable columns={myTaskColumns} data={tasks as any} />
);