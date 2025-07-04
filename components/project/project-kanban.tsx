"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { taskStatusVariant } from "@/utils";
import { Separator } from "../ui/separator";
import { DessertIcon } from "lucide-react";
import { updateTaskPosition } from "@/app/actions/task";
import { $Enums, TaskStatus } from "@/lib/generated/prisma";
import { Column, ProjectTaskProps } from "@/utils/types";
import { DragDropContext, Draggable, Droppable, DropResult } from "@hello-pangea/dnd"
import { ProjectCard } from "./project-card";

const COLUMN_TITLES: Record<$Enums.TaskStatus, string> = {
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  BLOCKED: "Blocked",
  BACKLOG: "Backlog",
  IN_REVIEW: "In Review",
};

export const ProjectKanban = ({
  initialTasks,
}: {
  initialTasks: ProjectTaskProps[];
}) => {
  const router = useRouter();

  if (initialTasks.length === 0) return null;

  const [columns, setColumns] = useState<Column[]>([]);

  useEffect(() => {
    const initialColumns: Column[] = Object.entries(COLUMN_TITLES).map(
      ([status, title]) => ({
        id: status as TaskStatus,
        title,
        tasks: initialTasks
          .filter((task) => task.status === status)
          .sort((a, b) => a.position - b.position),
      })
    );

    setColumns(initialColumns);
  }, [initialTasks]);

  const onDragEnd = useCallback(
    async (result: DropResult) => {
      const { destination, source } = result;

      if (!destination) return;

      const newColumns = [...columns];

      const sourceColumn = newColumns.find(
        (col) => col.id === source.droppableId
      );
      const destColumn = newColumns.find(
        (col) => col.id === destination.droppableId
      );

      if (!sourceColumn || !destColumn) return;

      const [movedTask] = sourceColumn.tasks.splice(source.index, 1);

      const destinationTasks = destColumn.tasks;

      let newPosition: number;

      if (destinationTasks.length === 0) {
        newPosition = 1000;
      } else if (destination.index === 0) {
        newPosition = destinationTasks[0].position - 1000;
      } else if (destination.index === destinationTasks.length) {
        newPosition =
          destinationTasks[destinationTasks.length - 1].position + 1000;
      } else {
        newPosition =
          (destinationTasks[destination.index - 1].position +
            destinationTasks[destination.index].position) /
          2;
      }

      const updatedTask = {
        ...movedTask,
        position: newPosition,
        status: destination.droppableId as TaskStatus,
      };

      destColumn.tasks.splice(destination.index, 0, updatedTask);

      setColumns(newColumns);

      try {
        await updateTaskPosition(
          movedTask.id,
          newPosition,
          destination.droppableId as TaskStatus
        );

        router.refresh();
      } catch (error) {
        console.log(error);
      }
    },
    [columns]
  );

  return (
    <div className="flex gap-4 h-full  md:px-4 overflow-x-auto">
      <DragDropContext onDragEnd={onDragEnd}>
        {columns.map((column) => (
          <div
            key={column.id}
            className="flex flex-col min-w-60 w-80 bg-gray-50 dark:bg-gray-900"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 mb-4 pl-3">
                <div
                  className={cn("size-4 rounded")}
                  style={{
                    backgroundColor: taskStatusVariant[column.id as TaskStatus],
                  }}
                />
                <h2 className="font-semibold">{column.title}</h2>
              </div>
            </div>

            <Separator className="mb-2" />

            <Droppable droppableId={column.id}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="flex-1 rounded-lg p-2"
                >
                  {column.tasks?.map((task, index) => (
                    <Draggable
                      key={task.id}
                      draggableId={task.id}
                      index={index}
                    >
                      {(provided) => (
                        <ProjectCard
                          ref={provided.innerRef}
                          provided={provided}
                          task={task}
                        />
                      )}
                    </Draggable>
                  ))}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </DragDropContext>
    </div>
  );
};