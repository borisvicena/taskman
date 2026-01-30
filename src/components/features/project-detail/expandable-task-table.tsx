"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Task } from "@/lib/types";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

type ExpandableTaskTableProps = {
  tasks: Task[];
  projectId: string;
};

export function ExpandableTaskTable({
  tasks,
  projectId,
}: ExpandableTaskTableProps) {
  const router = useRouter();
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());

  // Separate parent tasks and subtasks
  const parentTasks = tasks.filter(
    (task) => !task.parentTaskId || task.parentTaskId === ""
  );
  const subtasksByParent = tasks.reduce((acc, task) => {
    if (task.parentTaskId && task.parentTaskId !== "") {
      if (!acc[task.parentTaskId]) {
        acc[task.parentTaskId] = [];
      }
      acc[task.parentTaskId].push(task);
    }
    return acc;
  }, {} as Record<string, Task[]>);

  const toggleExpand = (taskId: string) => {
    const newExpanded = new Set(expandedTasks);
    if (newExpanded.has(taskId)) {
      newExpanded.delete(taskId);
    } else {
      newExpanded.add(taskId);
    }
    setExpandedTasks(newExpanded);
  };

  const handleRowClick = (taskId: string, e: React.MouseEvent) => {
    // Don't navigate if clicking the expand button
    if ((e.target as HTMLElement).closest("button")) {
      return;
    }
    router.push(`/dashboard/projects/${projectId}/tasks/${taskId}`);
  };

  if (!tasks || tasks.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center rounded-lg border border-dashed">
        <p className="text-sm text-muted-foreground">
          No tasks yet. Create one to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border shadow-sm">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow className="hover:bg-muted/50">
            <TableHead className="w-10"></TableHead>
            <TableHead className="font-semibold">Task Name</TableHead>
            <TableHead className="font-semibold">Assigned To</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="font-semibold">Priority</TableHead>
            <TableHead className="font-semibold">Due Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {parentTasks.map((task) => (
            <TaskRowGroup
              key={task._id}
              task={task}
              subtasks={subtasksByParent[task._id] || []}
              isExpanded={expandedTasks.has(task._id)}
              onToggleExpand={() => toggleExpand(task._id)}
              onRowClick={handleRowClick}
              projectId={projectId}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

type TaskRowGroupProps = {
  task: Task;
  subtasks: Task[];
  isExpanded: boolean;
  onToggleExpand: () => void;
  onRowClick: (taskId: string, e: React.MouseEvent) => void;
  projectId: string;
};

function TaskRowGroup({
  task,
  subtasks,
  isExpanded,
  onToggleExpand,
  onRowClick,
  projectId,
}: TaskRowGroupProps) {
  const hasSubtasks = subtasks.length > 0;

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "done":
        return {
          variant: "outline" as const,
          className: "bg-green-50 text-green-700 border-green-200",
        };
      case "in-progress":
        return {
          variant: "default" as const,
          className: "bg-blue-50 text-blue-700 border-blue-200",
        };
      case "todo":
        return {
          variant: "secondary" as const,
          className: "bg-gray-50 text-gray-700 border-gray-200",
        };
      default:
        return {
          variant: "secondary" as const,
          className: "bg-gray-50 text-gray-700 border-gray-200",
        };
    }
  };

  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case "high":
        return {
          variant: "destructive" as const,
          className: "bg-red-50 text-red-700 border-red-200",
        };
      case "medium":
        return {
          variant: "default" as const,
          className: "bg-orange-50 text-orange-700 border-orange-200",
        };
      case "low":
        return {
          variant: "secondary" as const,
          className: "bg-slate-50 text-slate-700 border-slate-200",
        };
      default:
        return {
          variant: "secondary" as const,
          className: "bg-gray-50 text-gray-700 border-gray-200",
        };
    }
  };

  const statusConfig = getStatusConfig(task.status);
  const priorityConfig = getPriorityConfig(task.priority);

  return (
    <>
      {/* Parent Task Row */}
      <TableRow
        className="cursor-pointer hover:bg-muted/30 transition-colors border-b"
        onClick={(e) => onRowClick(task._id, e)}
      >
        <TableCell className="py-4">
          {hasSubtasks && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 hover:bg-primary/10"
              onClick={(e) => {
                e.stopPropagation();
                onToggleExpand();
              }}
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 text-primary" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
          )}
        </TableCell>
        <TableCell className="py-4">
          <div className="space-y-1">
            <p className="font-semibold text-sm">{task.title}</p>
            {task.description && (
              <p className="text-xs text-muted-foreground line-clamp-1">
                {task.description}
              </p>
            )}
          </div>
        </TableCell>
        <TableCell className="py-4">
          <span className="text-sm text-muted-foreground">
            {task.assignedTo?.name || (
              <span className="italic">Unassigned</span>
            )}
          </span>
        </TableCell>
        <TableCell className="py-4">
          <Badge className={statusConfig.className}>
            <span className="capitalize">{task.status.replace("-", " ")}</span>
          </Badge>
        </TableCell>
        <TableCell className="py-4">
          <Badge className={priorityConfig.className}>
            <span className="capitalize">{task.priority}</span>
          </Badge>
        </TableCell>
        <TableCell className="py-4">
          {task.dueDate ? (
            <span className="text-sm font-medium">
              {format(new Date(task.dueDate), "MMM dd, yyyy")}
            </span>
          ) : (
            <span className="text-sm text-muted-foreground italic">No date</span>
          )}
        </TableCell>
      </TableRow>

      {/* Subtask Rows */}
      {isExpanded &&
        subtasks.map((subtask) => (
          <SubtaskRow
            key={subtask._id}
            subtask={subtask}
            projectId={projectId}
            onRowClick={onRowClick}
          />
        ))}
    </>
  );
}

type SubtaskRowProps = {
  subtask: Task;
  projectId: string;
  onRowClick: (taskId: string, e: React.MouseEvent) => void;
};

function SubtaskRow({ subtask, projectId, onRowClick }: SubtaskRowProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "done":
        return {
          className: "bg-green-50 text-green-700 border-green-200",
        };
      case "in-progress":
        return {
          className: "bg-blue-50 text-blue-700 border-blue-200",
        };
      case "todo":
        return {
          className: "bg-gray-50 text-gray-700 border-gray-200",
        };
      default:
        return {
          className: "bg-gray-50 text-gray-700 border-gray-200",
        };
    }
  };

  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case "high":
        return {
          className: "bg-red-50 text-red-700 border-red-200",
        };
      case "medium":
        return {
          className: "bg-orange-50 text-orange-700 border-orange-200",
        };
      case "low":
        return {
          className: "bg-slate-50 text-slate-700 border-slate-200",
        };
      default:
        return {
          className: "bg-gray-50 text-gray-700 border-gray-200",
        };
    }
  };

  const statusConfig = getStatusConfig(subtask.status);
  const priorityConfig = getPriorityConfig(subtask.priority);

  return (
    <TableRow
      className="bg-muted/20 border-b border-dashed"
    >
      <TableCell className="py-3"></TableCell>
      <TableCell className="py-3">
        <div className="pl-8 flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-muted-foreground/30"></div>
          <p className="text-sm font-medium text-muted-foreground">{subtask.title}</p>
        </div>
      </TableCell>
      <TableCell className="py-3">
        <span className="text-sm text-muted-foreground">
          {subtask.assignedTo?.name || (
            <span className="italic">Unassigned</span>
          )}
        </span>
      </TableCell>
      <TableCell className="py-3">
        <Badge className={`${statusConfig.className} text-xs`}>
          <span className="capitalize">{subtask.status.replace("-", " ")}</span>
        </Badge>
      </TableCell>
      <TableCell className="py-3">
        <Badge className={`${priorityConfig.className} text-xs`}>
          <span className="capitalize">{subtask.priority}</span>
        </Badge>
      </TableCell>
      <TableCell className="py-3">
        {subtask.dueDate ? (
          <span className="text-sm font-medium">
            {format(new Date(subtask.dueDate), "MMM dd, yyyy")}
          </span>
        ) : (
          <span className="text-sm text-muted-foreground italic">No date</span>
        )}
      </TableCell>
    </TableRow>
  );
}
