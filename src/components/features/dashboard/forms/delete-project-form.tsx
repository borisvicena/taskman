"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { deleteProject } from "@/lib/actions/project";
import { useRouter } from "next/navigation";

type Props = {
  projectId: string;
  projectName: string;
  onSuccess?: () => void;
};

export default function DeleteProjectForm({
  projectId,
  projectName,
  onSuccess,
}: Props) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteProject(projectId);

      if (result.error) {
        setError(result.error);
      } else {
        onSuccess?.();
        router.refresh();
      }
    });
  };

  return (
    <div>
      <DialogHeader>
        <DialogTitle>Delete Project</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete <strong>"{projectName}"</strong>? This
          will permanently remove the project and all its tasks. This action cannot
          be undone.
        </DialogDescription>
      </DialogHeader>

      {error && (
        <p className="py-4 text-sm text-destructive">{error}</p>
      )}

      <DialogFooter className="gap-2 sm:gap-0 mt-4">
        <Button
          type="button"
          variant="destructive"
          onClick={handleDelete}
          disabled={isPending}
        >
          {isPending && <Spinner />}
          Delete Project
        </Button>
      </DialogFooter>
    </div>
  );
}
