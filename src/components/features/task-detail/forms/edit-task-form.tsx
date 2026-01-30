"use client";

import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { updateTask } from "@/lib/actions/task";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { Task, Project } from "@/lib/types";

type Props = {
  task: Task;
  project: Project;
  onSuccess?: () => void;
};

export default function EditTaskForm({ task, project, onSuccess }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await updateTask(task._id, formData);

      if (result.error) {
        setError(result.error);
      } else {
        onSuccess?.();
        router.refresh();
      }
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>Edit Task</DialogTitle>
        <DialogDescription>Update the task details.</DialogDescription>
      </DialogHeader>

      <div className="py-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            placeholder="Task title"
            defaultValue={task.title}
            autoFocus
            tabIndex={1}
          />
        </div>
      </div>

      <div className="py-4">
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Describe the task..."
            defaultValue={task.description}
            tabIndex={2}
          />
        </div>
      </div>

      <div className="py-4">
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select name="status" defaultValue={task.status}>
            <SelectTrigger id="status" tabIndex={3} className="w-full">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Status</SelectLabel>
                <SelectItem value="todo">To Do</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="done">Done</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="py-4">
        <div className="space-y-2">
          <Label htmlFor="priority">Priority</Label>
          <Select name="priority" defaultValue={task.priority}>
            <SelectTrigger id="priority" tabIndex={4} className="w-full">
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Priority</SelectLabel>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="py-4">
        <div className="space-y-2">
          <Label htmlFor="assignedTo">Assigned To</Label>
          <Select name="assignedTo" defaultValue={task.assignedTo?._id || undefined}>
            <SelectTrigger id="assignedTo" tabIndex={5} className="w-full">
              <SelectValue placeholder="Unassigned (optional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Team Members</SelectLabel>
                <SelectItem value={project.ownerId}>
                  {project.ownerName || "Project Owner"} (Owner)
                </SelectItem>
                {project.members?.map((member) => (
                  <SelectItem key={member.userId} value={member.userId}>
                    {member.userName || "Unknown"} ({member.role})
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="py-4">
        <div className="space-y-2">
          <Label htmlFor="dueDate">Due Date</Label>
          <Input
            id="dueDate"
            name="dueDate"
            type="date"
            defaultValue={
              task.dueDate
                ? new Date(task.dueDate).toISOString().split("T")[0]
                : ""
            }
            tabIndex={6}
          />
        </div>
      </div>

      {error && (
        <p className="py-2 text-sm text-destructive">{error}</p>
      )}

      <DialogFooter>
        <Button type="submit" disabled={isPending} tabIndex={7}>
          {isPending && <Spinner />}
          Update Task
        </Button>
      </DialogFooter>
    </form>
  );
}
