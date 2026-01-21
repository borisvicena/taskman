"use client";

import { useState, useTransition } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { addTaskComment } from "@/lib/actions/task";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";

type Props = {
  taskId: string;
  onSuccess?: () => void;
};

export default function AddCommentForm({ taskId, onSuccess }: Props) {
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!content.trim()) {
      setError("Comment content is required");
      return;
    }

    startTransition(async () => {
      const result = await addTaskComment(taskId, content);

      if (result.error) {
        setError(result.error);
      } else {
        setContent("");
        onSuccess?.();
        router.refresh();
      }
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>Add Comment</DialogTitle>
        <DialogDescription>Share your thoughts on this task.</DialogDescription>
      </DialogHeader>

      <div className="py-4 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="content">Comment</Label>
          <Textarea
            id="content"
            placeholder="Type your comment here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
            autoFocus
            required
          />
        </div>
      </div>

      {error && <p className="py-2 text-sm text-destructive">{error}</p>}

      <DialogFooter>
        <Button type="submit" disabled={isPending}>
          {isPending && <Spinner />}
          Add Comment
        </Button>
      </DialogFooter>
    </form>
  );
}
