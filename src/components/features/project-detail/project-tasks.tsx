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
import { useState, useMemo } from "react";
import { ExpandableTaskTable } from "./expandable-task-table";
import TaskToolbar from "./task-toolbar";

type ProjectTasksProps = {
  project: Project;
  tasks: Task[];
};

export function ProjectTasks({ project, tasks }: ProjectTasksProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");

  const filteredTasks = useMemo(() => {
    let result = tasks;

    // Apply search filter
    if (searchQuery) {
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((t) => t.status === statusFilter);
    }

    // Apply priority filter
    if (priorityFilter !== "all") {
      result = result.filter((t) => t.priority === priorityFilter);
    }

    return result;
  }, [tasks, searchQuery, statusFilter, priorityFilter]);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>
            Tasks
            {filteredTasks.length !== tasks.length && (
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                ({filteredTasks.length} of {tasks.length})
              </span>
            )}
          </CardTitle>

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
                  project={project}
                  onSuccess={() => setOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </CardAction>
        </CardHeader>

        <CardContent className="space-y-4">
          <TaskToolbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            priorityFilter={priorityFilter}
            onPriorityChange={setPriorityFilter}
          />

          <ExpandableTaskTable
            tasks={filteredTasks}
            projectId={project._id}
          />
        </CardContent>
      </Card>
    </div>
  );
}
