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
import { addProjectMember } from "@/lib/actions/project";
import { useRouter } from "next/navigation";
import { Mail } from "lucide-react";

type Props = {
  projectId: string;
  onSuccess?: () => void;
};

export default function AddMemberForm({ projectId, onSuccess }: Props) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"editor" | "viewer">("viewer");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    startTransition(async () => {
      // For now, we'll use a placeholder userId
      // In a real app, you'd look up the user by email first
      const result = await addProjectMember(projectId, email, role);

      if (result.error) {
        setError(result.error);
      } else {
        setEmail("");
        setRole("viewer");
        onSuccess?.();
        router.refresh();
      }
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>Add Team Member</DialogTitle>
        <DialogDescription>
          Invite a team member to collaborate on this project.
        </DialogDescription>
      </DialogHeader>

      <div className="py-4 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="colleague@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-9"
              autoFocus
              required
            />
          </div>
          <p className="text-xs text-muted-foreground">
            The user must have an account to be added to the project.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Select value={role} onValueChange={(val) => setRole(val as "editor" | "viewer")}>
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="viewer">
                <div className="flex flex-col">
                  <span className="font-medium">Viewer</span>
                  <span className="text-xs text-muted-foreground">Can view and comment</span>
                </div>
              </SelectItem>
              <SelectItem value="editor">
                <div className="flex flex-col">
                  <span className="font-medium">Editor</span>
                  <span className="text-xs text-muted-foreground">Can edit, create, and delete tasks</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {error && <p className="py-2 text-sm text-destructive">{error}</p>}

      <DialogFooter>
        <Button type="submit" disabled={isPending}>
          {isPending && <Spinner />}
          Add Member
        </Button>
      </DialogFooter>
    </form>
  );
}
