"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Task, Project } from "@/lib/types";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import EditSubtaskForm from "./forms/edit-subtask-form";
import DeleteSubtaskButton from "./delete-subtask-button";

type SubtaskTableProps = {
  subtasks: Task[];
  projectId: string;
  project: Project;
};

export function SubtaskTable({ subtasks, projectId, project }: SubtaskTableProps) {
  if (!subtasks || subtasks.length === 0) {
    return (
      <div className="flex h-24 items-center justify-center text-sm text-muted-foreground">
        No subtasks yet. Create one to get started.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Task Name</TableHead>
            <TableHead>Assigned To</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead className="w-25">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subtasks.map((subtask) => (
            <SubtaskRow
              key={subtask._id}
              subtask={subtask}
              projectId={projectId}
              project={project}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

type SubtaskRowProps = {
  subtask: Task;
  projectId: string;
  project: Project;
};

function SubtaskRow({ subtask, projectId, project }: SubtaskRowProps) {
  const [editOpen, setEditOpen] = useState(false);

  return (
    <TableRow>
      <TableCell className="font-medium">{subtask.title}</TableCell>
      <TableCell>
        <span className="text-sm text-muted-foreground">
          {subtask.assignedTo?.name || (
            <span className="italic">Unassigned</span>
          )}
        </span>
      </TableCell>
      <TableCell>
        <Badge variant="outline">
          <div className="capitalize">{subtask.status}</div>
        </Badge>
      </TableCell>
      <TableCell>
        <Badge variant="outline">
          <div className="capitalize">{subtask.priority}</div>
        </Badge>
      </TableCell>
      <TableCell>
        {subtask.dueDate ? (
          <span className="text-sm font-medium">
            {format(new Date(subtask.dueDate), "MMM dd, yyyy")}
          </span>
        ) : (
          <span className="text-sm text-muted-foreground italic">No date</span>
        )}
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
              <DialogTrigger asChild>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onSelect={(e) => e.preventDefault()}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <EditSubtaskForm
                  subtask={subtask}
                  project={project}
                  onSuccess={() => setEditOpen(false)}
                />
              </DialogContent>
            </Dialog>
            <DropdownMenuSeparator />
            <DeleteSubtaskButton
              subtaskId={subtask._id}
              subtaskTitle={subtask.title}
              projectId={projectId}
            />
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
