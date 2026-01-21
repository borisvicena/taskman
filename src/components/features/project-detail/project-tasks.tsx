"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Project, Task } from "@/lib/types";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import AddTaskForm from "./forms/add-task-form";
import { useState } from "react";
import { ExpandableTaskTable } from "./expandable-task-table";

type ProjectTasksProps = {
  project: Project;
  tasks: Task[];
};

export function ProjectTasks({ project, tasks }: ProjectTasksProps) {
  const [open, setOpen] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tasks</CardTitle>

        <CardAction>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Create Task
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-4xl">
              <AddTaskForm
                projectId={project._id}
                onSuccess={() => setOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </CardAction>
      </CardHeader>

      <CardContent>
        <ExpandableTaskTable tasks={tasks} projectId={project._id} />
      </CardContent>
    </Card>
  );
}
