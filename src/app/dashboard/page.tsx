import { Metadata } from "next";
import { getProjects, verifySession } from "@/lib/dal";
import { DashboardContent } from "@/components/features/dashboard/dashboard-content";

export const metadata: Metadata = {
  title: "Dashboard | TaskMan",
  description:
    "Manage all your projects, tasks, and subtasks in one organized space",
};

export default async function Dashboard() {
  // Get all user projects
  const projects = await getProjects();
  const session = await verifySession();

  return <DashboardContent projects={projects} userId={session.userId || ""} />;
}
