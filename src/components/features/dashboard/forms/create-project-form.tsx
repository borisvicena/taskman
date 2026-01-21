"use client";

import { useActionState, useEffect } from "react";
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
import { createProject } from "@/lib/actions/project";

type Props = {
  onSuccess?: () => void;
};

export default function CreateProjectForm({ onSuccess }: Props) {
  const [state, action, pending] = useActionState(createProject, undefined);

  useEffect(() => {
    if (state?.success) {
      onSuccess?.();
    }
  }, [state, onSuccess]);

  return (
    <form action={action}>
      <DialogHeader>
        <DialogTitle>New Project</DialogTitle>
        <DialogDescription>
          Give your project a name and description.
        </DialogDescription>
      </DialogHeader>

      <div className="py-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="Project Alpha"
            autoFocus
            tabIndex={1}
          />
          {state?.errors?.name && (
            <p className="text-sm text-destructive">{state.errors.name[0]}</p>
          )}
        </div>
      </div>

      <div className="py-4">
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            name="description"
            placeholder="Super secret project"
            tabIndex={2}
          />
        </div>
      </div>

      {state?.message && (
        <p className="text-sm text-destructive">{state.message}</p>
      )}

      <DialogFooter>
        <Button type="submit" disabled={pending} tabIndex={3}>
          {pending && <Spinner />}
          Create
        </Button>
      </DialogFooter>
    </form>
  );
}
