import { $Enums, AccessLevel, Comment, Task, TaskStatus, WorkspaceMember } from "@/lib/generated/prisma";


export interface WorkspaceMembersProps extends WorkspaceMember{
    user: {
        id: string;
        name: string;
        email: string;
        image?: string;
    };
    projectAccess: {
        id: string;
        hasAccess: boolean;
        projectId: string;
    }[];
}

export interface ProjectProps {
    id: string;
    name: string;
    description?: string;
    workspaceId: string;
    members: {
        id: string;
        userId: string;
        workspaceId: string;
        acessLevel: AccessLevel;
        user: {
            id: string;
            name: string;
            email: string;
            image?: string;
        };
    }[];
}

export interface WorkspacesProps {
  id: string;
  createdAt: Date;
  userId: string;
  workspaceId: string;
  acessLevel: $Enums.AccessLevel;
  workspace: {
    name: string;
  };
}

export interface CommentProps extends Comment {
    user: {id: string; name: string; image: string }; 
}

export interface ProjectTaskProps extends Task {
  assignedTo: {
    id: string;
    name: string;
    image?: string;
  };
  project: { id: string; name: string };
}

export interface Column {
  id: TaskStatus;
  title: string;
  tasks: ProjectTaskProps[];
}