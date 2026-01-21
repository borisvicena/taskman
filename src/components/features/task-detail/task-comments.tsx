"use client";

import { Button } from "@/components/ui/button";
import { Plus, MessageSquare } from "lucide-react";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Task } from "@/lib/types";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { CommentList } from "./comment-list";
import AddCommentForm from "./forms/add-comment-form";
import { Badge } from "@/components/ui/badge";

type TaskCommentsProps = {
  task: Task;
};

export function TaskComments({ task }: TaskCommentsProps) {
  const [open, setOpen] = useState(false);

  const commentCount = task.comments?.length || 0;

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-teal-100 p-2">
              <MessageSquare className="h-5 w-5 text-teal-600" />
            </div>
            <div>
              <CardTitle className="text-xl">Comments</CardTitle>
              {commentCount > 0 && (
                <p className="text-sm text-muted-foreground mt-1">
                  {commentCount} {commentCount === 1 ? "comment" : "comments"}
                </p>
              )}
            </div>
            {commentCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {commentCount}
              </Badge>
            )}
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 shadow-sm">
                <Plus className="h-4 w-4" />
                Add Comment
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
              <AddCommentForm taskId={task._id} onSuccess={() => setOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent>
        <CommentList comments={task.comments} taskId={task._id} />
      </CardContent>
    </Card>
  );
}
