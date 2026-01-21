"use client";

import { Comment } from "@/lib/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { deleteTaskComment } from "@/lib/actions/task";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Spinner } from "@/components/ui/spinner";

type CommentListProps = {
  comments: Comment[];
  taskId: string;
};

export function CommentList({ comments, taskId }: CommentListProps) {
  if (!comments || comments.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center rounded-lg border border-dashed">
        <p className="text-sm text-muted-foreground">
          No comments yet. Be the first to add one!
        </p>
      </div>
    );
  }

  // Sort comments by date (newest first)
  const sortedComments = [...comments].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="space-y-3">
      {sortedComments.map((comment) => (
        <CommentItem key={comment._id} comment={comment} taskId={taskId} />
      ))}
    </div>
  );
}

type CommentItemProps = {
  comment: Comment;
  taskId: string;
};

function CommentItem({ comment, taskId }: CommentItemProps) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // Get initials from author name (assuming comment has author info populated)
  const getInitials = (name: string) => {
    if (!name) return "U";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteTaskComment(taskId, comment._id);

      if (result.error) {
        setError(result.error);
      } else {
        setDeleteOpen(false);
        router.refresh();
      }
    });
  };

  const authorName = comment.authorName || "Unknown User";

  return (
    <div className="group flex gap-3 rounded-lg border bg-card p-4 transition-colors hover:bg-accent/50">
      <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
        <AvatarFallback className="bg-teal-100 text-teal-700 font-semibold">
          {getInitials(authorName)}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 space-y-2">
        <div className="flex items-start justify-between">
          <div className="space-y-0.5">
            <p className="text-sm font-semibold">{authorName}</p>
            <p className="text-xs text-muted-foreground">
              {formatDate(comment.createdAt)}
            </p>
          </div>

          <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Comment</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this comment? This action
                  cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <AlertDialogFooter>
                <AlertDialogCancel disabled={isPending}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={isPending}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isPending && <Spinner />}
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <p className="text-sm leading-relaxed text-foreground">{comment.content}</p>
      </div>
    </div>
  );
}
