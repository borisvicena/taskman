"use client";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Project } from "@/lib/types";
import { TaskHeader } from "./task-header";
import { Task } from "@/lib/types";
import { TaskSubtasks } from "./task-subtasks";
import { TaskComments } from "./task-comments";

type TaskDetailContentProps = {
  task: Task;
  project: Project;
  subtasks: Task[];
};

export function TaskDetailContent({
  project,
  task,
  subtasks,
}: TaskDetailContentProps) {
  return (
    <main className="min-h-screen bg-linear-to-b from-background to-muted/20">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <Link
            href={`/dashboard/projects/${project._id}`}
            className="group inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-all hover:text-foreground hover:gap-3"
            aria-label="Back to project"
          >
            <ChevronLeft className="h-4 w-4 transition-transform" />
            <span>Back to {project.name}</span>
          </Link>

          <TaskHeader task={task} project={project} />

          <div className="grid gap-6 lg:grid-cols-1">
            <TaskSubtasks task={task} subtasks={subtasks} project={project} />
            <TaskComments task={task} />
          </div>
        </div>
      </div>
    </main>
  );
}
