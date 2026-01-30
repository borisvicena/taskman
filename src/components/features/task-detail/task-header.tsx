"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Task, Project } from "@/lib/types";
import { Calendar, Flag, User, CheckCircle2, Pencil } from "lucide-react";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import EditTaskForm from "./forms/edit-task-form";
import DeleteTaskButton from "./delete-task-button";

type TaskHeaderProps = {
  task: Task;
  project: Project;
};

export function TaskHeader({ task, project }: TaskHeaderProps) {
  const [editOpen, setEditOpen] = useState(false);

  // Get status config with colors
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "done":
        return {
          variant: "outline" as const,
          label: "Completed",
          color: "bg-green-500",
          className: "bg-green-50 text-green-700 border-green-200",
        };
      case "in-progress":
        return {
          variant: "default" as const,
          label: "In Progress",
          color: "bg-blue-500",
          className: "bg-blue-50 text-blue-700 border-blue-200",
        };
      case "todo":
        return {
          variant: "secondary" as const,
          label: "To Do",
          color: "bg-gray-500",
          className: "bg-gray-50 text-gray-700 border-gray-200",
        };
      default:
        return {
          variant: "secondary" as const,
          label: status,
          color: "bg-gray-500",
          className: "bg-gray-50 text-gray-700 border-gray-200",
        };
    }
  };

  // Get priority config with colors
  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case "high":
        return {
          label: "High Priority",
          color: "bg-red-500",
          className: "bg-red-50 text-red-700 border-red-200",
          icon: "🔴",
        };
      case "medium":
        return {
          label: "Medium Priority",
          color: "bg-orange-500",
          className: "bg-orange-50 text-orange-700 border-orange-200",
          icon: "🟠",
        };
      case "low":
        return {
          label: "Low Priority",
          color: "bg-slate-500",
          className: "bg-slate-50 text-slate-700 border-slate-200",
          icon: "⚪",
        };
      default:
        return {
          label: priority,
          color: "bg-gray-500",
          className: "bg-gray-50 text-gray-700 border-gray-200",
          icon: "⚪",
        };
    }
  };

  const statusConfig = getStatusConfig(task.status);
  const priorityConfig = getPriorityConfig(task.priority);

  return (
    <Card className="border-l-4" style={{ borderLeftColor: statusConfig.color.replace('bg-', '#') }}>
      <CardHeader>
        <div className="space-y-4">
          {/* Title, Badges and Actions */}
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-3 flex-1">
              <CardTitle className="text-3xl font-bold leading-tight">
                {task.title}
              </CardTitle>

              <div className="flex flex-wrap gap-2">
                <Badge className={statusConfig.className}>
                  <CheckCircle2 className="mr-1 h-3 w-3" />
                  {statusConfig.label}
                </Badge>
                <Badge className={priorityConfig.className}>
                  <Flag className="mr-1 h-3 w-3" />
                  {priorityConfig.label}
                </Badge>
              </div>
            </div>

            {/* Edit and Delete Buttons */}
            <div className="flex gap-2">
              <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Pencil className="h-4 w-4" />
                    Edit
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-4xl">
                  <EditTaskForm
                    task={task}
                    project={project}
                    onSuccess={() => setEditOpen(false)}
                  />
                </DialogContent>
              </Dialog>

              <DeleteTaskButton
                taskId={task._id}
                taskTitle={task.title}
                projectId={task.projectId}
              />
            </div>
          </div>

          {/* Description */}
          {task.description && (
            <p className="text-muted-foreground leading-relaxed">
              {task.description}
            </p>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Assigned To */}
          <div className="rounded-lg border bg-card p-4 space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span className="font-medium">Assigned To</span>
            </div>
            <p className="text-sm font-semibold">
              {task.assignedTo?.name || (
                <span className="text-muted-foreground italic">Unassigned</span>
              )}
            </p>
          </div>

          {/* Due Date */}
          <div className="rounded-lg border bg-card p-4 space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span className="font-medium">Due Date</span>
            </div>
            <p className="text-sm font-semibold">
              {task.dueDate ? (
                <>
                  {format(new Date(task.dueDate), "MMM dd, yyyy")}
                  <span className="block text-xs text-muted-foreground mt-1">
                    {format(new Date(task.dueDate), "EEEE")}
                  </span>
                </>
              ) : (
                <span className="text-muted-foreground italic">No due date</span>
              )}
            </p>
          </div>

          {/* Created Date */}
          <div className="rounded-lg border bg-card p-4 space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span className="font-medium">Created</span>
            </div>
            <p className="text-sm font-semibold">
              {format(new Date(task.createdAt), "MMM dd, yyyy")}
              <span className="block text-xs text-muted-foreground mt-1">
                {format(new Date(task.createdAt), "h:mm a")}
              </span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
