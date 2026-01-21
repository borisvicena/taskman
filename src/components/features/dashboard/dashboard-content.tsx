import { Project } from "@/lib/types";
import Toolbar from "./toolbar";
import { ProjectCard } from "./project-card";
import { DashboardStats } from "./dashboard-stats";
import { FolderOpen } from "lucide-react";

interface DashboardContentProps {
  projects: Project[];
  userId: string;
}

export function DashboardContent({ projects, userId }: DashboardContentProps) {
  const hasProjects = projects && projects.length > 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          Manage all your projects, tasks, and subtasks in one organized space
        </p>
      </header>

      {/* Stats Overview */}
      {hasProjects && <DashboardStats projects={projects} />}

      {/* Toolbar */}
      <Toolbar />

      {/* Projects Grid */}
      {hasProjects ? (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Your Projects</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project: Project) => (
              <ProjectCard key={project._id} project={project} userId={userId} />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex min-h-100 flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 p-8 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <FolderOpen className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="mt-6 text-xl font-semibold">No projects yet</h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-sm">
            Get started by creating your first project. Click the "Create Project" button above to begin organizing your work.
          </p>
        </div>
      )}
    </div>
  );
}
