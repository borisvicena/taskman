import { ProjectDetailContent } from "@/components/features/project-detail/project-detail-content";
import {
  getProjectDetails,
  getProjectDetailsWithTasks,
  verifySession,
} from "@/lib/dal";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ListDetailPage({ params }: Props) {
  const { id } = await params;

  const session = await verifySession();
  const userId = session.userId;

  const projectDetails = await getProjectDetails(id);
  console.log("Project details", projectDetails);

  if (!projectDetails) {
    notFound();
  }

  const projectWithTasks = await getProjectDetailsWithTasks(id);
  console.log("Project with tasks", projectWithTasks);

  if (!projectWithTasks) {
    notFound();
  }

  return (
    <ProjectDetailContent
      project={projectDetails}
      tasks={projectWithTasks.tasks || []}
      isOwner={userId === projectDetails.ownerId}
    />
  );
}
