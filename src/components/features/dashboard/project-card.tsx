"use client";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreVertical, Users, CalendarClock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Project } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Progress } from "../../ui/progress";
import { format, formatDistance } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DeleteProjectButton from "./delete-project-button";
import EditProjectButton from "./edit-project-button";
import { useRouter } from "next/navigation";

interface ProjectCardProps {
  project: Project;
  userId: string;
}

export function ProjectCard({ project, userId }: ProjectCardProps) {
  const router = useRouter();

  // Count members + owner
  const membersCount = project.members.length + 1;

  // Get status color and variant
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

  const statusConfig = getStatusConfig(project.status);

  // Calculate actual progress from task data
  const progress =
    project.totalTasks && project.totalTasks > 0
      ? Math.round((project.completedTasks! / project.totalTasks) * 100)
      : 0;

  const handleCardClick = () => {
    router.push(`/dashboard/projects/${project._id}`);
  };

  return (
    <Card
      className="group cursor-pointer border-l-4 transition-all hover:shadow-md hover:border-l-primary"
      style={{ borderLeftColor: statusConfig.color.replace('bg-', '#') }}
      onClick={handleCardClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1 flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <CardTitle className="truncate">{project.name}</CardTitle>
              <ArrowRight className="h-4 w-4 shrink-0 opacity-0 transition-opacity group-hover:opacity-100 text-primary" />
            </div>
            <Badge variant={statusConfig.variant} className="w-fit">
              {statusConfig.label}
            </Badge>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                aria-label="Project actions"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48" onClick={(e) => e.stopPropagation()}>
                <DropdownMenuItem asChild>
                  <Link
                    href={`/dashboard/projects/${project._id}`}
                    className="cursor-pointer"
                  >
                    Open Project
                  </Link>
                </DropdownMenuItem>
                {userId === project.ownerId && (
                  <>
                    <EditProjectButton project={project} />
                    <DeleteProjectButton
                      projectId={project._id}
                      projectName={project.name}
                    />
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <CardDescription className="line-clamp-2 min-h-10">
            {project.description || "No description provided"}
          </CardDescription>
        </CardHeader>

        <CardContent className="pb-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground font-medium">Progress</span>
              <span className="font-semibold">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardContent>

        <CardFooter className="flex-col gap-3 border-t pt-3">
          <div className="flex w-full items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Users className="h-3.5 w-3.5" />
              <span className="font-medium">{membersCount} member{membersCount !== 1 ? 's' : ''}</span>
            </div>

            {project.dueDate && (
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <CalendarClock className="h-3.5 w-3.5" />
                <span className="font-medium">{format(new Date(project.dueDate), "MMM dd")}</span>
              </div>
            )}
          </div>

          <div className="w-full text-xs text-muted-foreground">
            <span>Created {formatDistance(project.createdAt, new Date(), { addSuffix: true })}</span>
          </div>
        </CardFooter>
      </Card>
  );
}
