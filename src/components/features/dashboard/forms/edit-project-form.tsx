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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateProject } from "@/lib/actions/project";
import { useRouter } from "next/navigation";
import { Project } from "@/lib/types";

type Props = {
  project: Project;
  onSuccess?: () => void;
};

export default function EditProjectForm({ project, onSuccess }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await updateProject(project._id, formData);

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
        <DialogTitle>Edit Project</DialogTitle>
        <DialogDescription>
          Update your project details below.
        </DialogDescription>
      </DialogHeader>

      <div className="py-4 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="Project Alpha"
            defaultValue={project.name}
            autoFocus
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            name="description"
            placeholder="Project description"
            defaultValue={project.description || ""}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select name="status" defaultValue={project.status}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="on-hold">On Hold</SelectItem>
              <SelectItem value="done">Done</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="dueDate">Due Date</Label>
          <Input
            id="dueDate"
            name="dueDate"
            type="date"
            defaultValue={
              project.dueDate
                ? new Date(project.dueDate).toISOString().split("T")[0]
                : ""
            }
          />
        </div>
      </div>

      {error && (
        <p className="py-2 text-sm text-destructive">{error}</p>
      )}

      <DialogFooter className="gap-2 sm:gap-0">
        <Button type="submit" disabled={isPending}>
          {isPending && <Spinner />}
          Update Project
        </Button>
      </DialogFooter>
    </form>
  );
}
