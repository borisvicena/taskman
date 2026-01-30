"use client";

import { Button } from "@/components/ui/button";
import { Pencil, Plus, Users as UsersIcon, Calendar, Target, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Project } from "@/lib/types";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import EditProjectForm from "@/components/features/dashboard/forms/edit-project-form";
import AddMemberForm from "./forms/add-member-form";
import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type ProjectOverviewProps = {
  project: Project;
  isOwner: boolean;
  tasks: any[];
};

export function ProjectOverview({
  project,
  isOwner,
  tasks,
}: ProjectOverviewProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [addMemberOpen, setAddMemberOpen] = useState(false);

  // Calculate progress based on completed tasks
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.status === "done").length;
  const inProgressTasks = tasks.filter((task) => task.status === "in-progress").length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  // Get status config with colors
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "active":
        return {
          variant: "default" as const,
          label: "Active",
          color: "bg-green-500",
          textColor: "text-green-700",
          bgColor: "bg-green-50",
        };
      case "on-hold":
        return {
          variant: "secondary" as const,
          label: "On Hold",
          color: "bg-orange-500",
          textColor: "text-orange-700",
          bgColor: "bg-orange-50",
        };
      case "done":
        return {
          variant: "outline" as const,
          label: "Completed",
          color: "bg-blue-500",
          textColor: "text-blue-700",
          bgColor: "bg-blue-50",
        };
      default:
        return {
          variant: "secondary" as const,
          label: status,
          color: "bg-gray-500",
          textColor: "text-gray-700",
          bgColor: "bg-gray-50",
        };
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "?";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const statusConfig = getStatusConfig(project.status);
  const teamCount = 1 + (project.members?.length || 0);

  return (
    <Card className="border-l-4" style={{ borderLeftColor: statusConfig.color.replace('bg-', '#') }}>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <CardTitle className="text-3xl font-bold">{project.name}</CardTitle>
              <Badge variant={statusConfig.variant} className="text-xs">
                {statusConfig.label}
              </Badge>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              {project.description || "No description provided"}
            </p>
          </div>

          {isOwner && (
            <div className="flex gap-2">
              <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Pencil className="h-4 w-4" />
                    Edit
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <EditProjectForm
                    project={project}
                    onSuccess={() => setEditOpen(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Progress Card */}
          <div className="rounded-lg border bg-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-blue-100 p-2">
                  <Target className="h-4 w-4 text-blue-600" />
                </div>
                <span className="text-sm font-medium">Progress</span>
              </div>
              <span className="text-2xl font-bold">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {completedTasks} of {totalTasks} tasks completed
            </p>
          </div>

          {/* Tasks Summary Card */}
          <div className="rounded-lg border bg-card p-4 space-y-3">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-purple-100 p-2">
                <UsersIcon className="h-4 w-4 text-purple-600" />
              </div>
              <span className="text-sm font-medium">Tasks</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">In Progress:</span>
                <span className="font-semibold">{inProgressTasks}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Remaining:</span>
                <span className="font-semibold">{totalTasks - completedTasks}</span>
              </div>
            </div>
          </div>

          {/* Due Date Card */}
          {project.dueDate && (
            <div className="rounded-lg border bg-card p-4 space-y-3">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-orange-100 p-2">
                  <Calendar className="h-4 w-4 text-orange-600" />
                </div>
                <span className="text-sm font-medium">Due Date</span>
              </div>
              <p className="text-lg font-semibold">
                {format(new Date(project.dueDate), "MMM dd, yyyy")}
              </p>
              <p className="text-xs text-muted-foreground">
                {format(new Date(project.dueDate), "EEEE")}
              </p>
            </div>
          )}
        </div>

        {/* Team Members Section */}
        <div className="rounded-lg border bg-card p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UsersIcon className="h-5 w-5 text-muted-foreground" />
              <h3 className="font-semibold">Team Members</h3>
              <Badge variant="secondary" className="ml-2">
                {teamCount}
              </Badge>
            </div>
            {isOwner && (
              <Dialog open={addMemberOpen} onOpenChange={setAddMemberOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Member
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <AddMemberForm
                    projectId={project._id}
                    onSuccess={() => setAddMemberOpen(false)}
                  />
                </DialogContent>
              </Dialog>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            {/* Owner Avatar */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2 rounded-full border-2 border-primary bg-primary/10 pl-1 pr-3 py-1">
                    <Avatar className="h-7 w-7">
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                        {getInitials(project.ownerName || "Owner")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-xs font-medium">{project.ownerName || "Owner"}</span>
                      <span className="text-[10px] text-muted-foreground">Full Access</span>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{project.ownerName || "Project Owner"} - {project.ownerEmail || "No email"}</p>
                  <p className="text-xs text-muted-foreground">Project Owner - Full Access</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Member Avatars */}
            {project.members?.map((member, index) => (
              <TooltipProvider key={index}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-2 rounded-full border bg-card pl-1 pr-3 py-1 hover:bg-accent transition-colors">
                      <Avatar className="h-7 w-7">
                        <AvatarFallback className="bg-muted text-xs">
                          {getInitials(member.userName || `Member ${index + 1}`)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-xs font-medium">{member.userName || `Member ${index + 1}`}</span>
                        <span className="text-[10px] text-muted-foreground capitalize">
                          {member.role}
                        </span>
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{member.userName || "Unknown Member"} - {member.userEmail || "No email"}</p>
                    <p className="text-xs capitalize text-muted-foreground">{member.role} - Can {member.role === "editor" ? "edit and create" : "view only"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
