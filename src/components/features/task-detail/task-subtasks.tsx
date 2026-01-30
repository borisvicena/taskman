"use client";

import { Button } from "@/components/ui/button";
import { Plus, ListTodo } from "lucide-react";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Task } from "@/lib/types";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { SubtaskTable } from "./subtask-table";
import AddSubtaskForm from "./forms/add-subtask-form";
import { Badge } from "@/components/ui/badge";
import { Project } from "@/lib/types";

type TaskSubtasksProps = {
  task: Task;
  subtasks: Task[];
  project: Project;
};

export function TaskSubtasks({ task, subtasks, project }: TaskSubtasksProps) {
  const [open, setOpen] = useState(false);

  const completedSubtasks = subtasks.filter((s) => s.status === "done").length;
  const totalSubtasks = subtasks.length;

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-purple-100 p-2">
              <ListTodo className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <CardTitle className="text-xl">Subtasks</CardTitle>
              {totalSubtasks > 0 && (
                <p className="text-sm text-muted-foreground mt-1">
                  {completedSubtasks} of {totalSubtasks} completed
                </p>
              )}
            </div>
            {totalSubtasks > 0 && (
              <Badge variant="secondary" className="ml-2">
                {totalSubtasks}
              </Badge>
            )}
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 shadow-sm">
                <Plus className="h-4 w-4" />
                Create Subtask
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-4xl">
              <AddSubtaskForm
                projectId={task.projectId}
                parentTaskId={task._id}
                project={project}
                onSuccess={() => setOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent>
        <SubtaskTable subtasks={subtasks} projectId={task.projectId} project={project} />
      </CardContent>
    </Card>
  );
}
