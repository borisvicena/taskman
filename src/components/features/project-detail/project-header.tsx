"use client";

import { Button } from "@/components/ui/button";
import { Pencil, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Project } from "@/lib/types";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import EditProjectForm from "@/components/features/dashboard/forms/edit-project-form";
import { useState } from "react";

type ProjectHeaderProps = {
  project: Project;
  isOwner: boolean;
};

export function ProjectHeader({ project, isOwner }: ProjectHeaderProps) {
  const [editOpen, setEditOpen] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">{project.name}</CardTitle>
        <CardDescription>{project.description}</CardDescription>

        {isOwner && (
          <CardAction>
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Pencil className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <EditProjectForm
                  project={project}
                  onSuccess={() => setEditOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </CardAction>
        )}
      </CardHeader>

      <CardContent>
        <span className="text-xs text-neutral-500">Progress</span>
        <Progress value={30} />
      </CardContent>

      <CardFooter>
        {project.dueDate && (
          <div>
            <span className="text-xs text-neutral-500 font-bold">Due Date</span>
            <span>{format(project.dueDate, "MM/dd/yyyy")}</span>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
