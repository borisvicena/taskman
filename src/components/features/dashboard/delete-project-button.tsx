"use client";

import { useState } from "react";
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import DeleteProjectForm from "@/components/features/dashboard/forms/delete-project-form";

type Props = {
  projectId: string;
  projectName: string;
};

export default function DeleteProjectButton({ projectId, projectName }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <DropdownMenuSeparator />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <DropdownMenuItem
            className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-600"
            onSelect={(e) => e.preventDefault()} // Prevent dropdown from closing
          >
            Delete
          </DropdownMenuItem>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DeleteProjectForm
            projectId={projectId}
            projectName={projectName}
            onSuccess={() => setOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
