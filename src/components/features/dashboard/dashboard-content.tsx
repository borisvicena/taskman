"use client";

import { useState, useMemo } from "react";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredProjects = useMemo(() => {
    let result = projects;

    // Apply search filter
    if (searchQuery) {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((p) => p.status === statusFilter);
    }

    return result;
  }, [projects, searchQuery, statusFilter]);

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
      <Toolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
      />

      {/* Projects Grid */}
      {hasProjects ? (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">
            Your Projects
            {filteredProjects.length !== projects.length && (
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                ({filteredProjects.length} of {projects.length})
              </span>
            )}
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project: Project) => (
                <ProjectCard key={project._id} project={project} userId={userId} />
              ))
            ) : (
              <div className="col-span-full flex min-h-[200px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 p-8 text-center">
                <p className="text-muted-foreground">
                  No projects match your filters
                </p>
              </div>
            )}
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
