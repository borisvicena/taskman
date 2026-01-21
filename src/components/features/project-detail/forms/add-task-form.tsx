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
import { createTask } from "@/lib/actions/task";
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

type Props = {
  projectId: string;
  onSuccess?: () => void;
};

export default function AddTaskForm({ projectId, onSuccess }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await createTask(projectId, formData);

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
        <DialogTitle>New Task</DialogTitle>
        <DialogDescription>Add a new task to your project.</DialogDescription>
      </DialogHeader>

      <div className="py-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            placeholder="Task Alpha"
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
            placeholder="Super secret project"
            tabIndex={2}
          />
        </div>
      </div>

      <div className="py-4">
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select name="status">
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
          <Select name="priority">
            <SelectTrigger id="priority" tabIndex={4} className="w-full">
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Priority</SelectLabel>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">Hight</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="py-4">
        <div className="space-y-2">
          <Label htmlFor="assignedTo">Assigned To</Label>
          <Input
            id="assignedTo"
            name="assignedTo"
            placeholder="Super secret project"
            tabIndex={5}
          />
        </div>
      </div>

      <div className="py-4">
        <div className="space-y-2">
          <Label htmlFor="parentTaskId">Parent Task</Label>
          <Input
            id="parentTaskId"
            name="parentTaskId"
            placeholder="Super secret project"
            tabIndex={6}
          />
        </div>
      </div>

      <div className="py-4">
        <div className="space-y-2">
          <Label htmlFor="dueDate">Due Date</Label>
          <Input
            id="dueDate"
            name="dueDate"
            placeholder="Super secret project"
            tabIndex={7}
          />
        </div>
      </div>

      {error && (
        <p className="py-2 text-sm text-destructive">{error}</p>
      )}

      <DialogFooter>
        <Button type="submit" disabled={isPending} tabIndex={8}>
          {isPending && <Spinner />}
          Create Task
        </Button>
      </DialogFooter>
    </form>
  );
}
