"use client";

import { useState } from "react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import EditProjectForm from "@/components/features/dashboard/forms/edit-project-form";
import { Project } from "@/lib/types";

type Props = {
  project: Project;
};

export default function EditProjectButton({ project }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={(e) => e.preventDefault()} // Prevent dropdown from closing
        >
          Edit Project
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <EditProjectForm
          project={project}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
