import { TaskDetailContent } from "@/components/features/task-detail/task-detail-content";
import {
  getProjectDetails,
  getProjectTaskDetails,
  getTaskSubtasks,
  verifySession,
} from "@/lib/dal";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string; taskId: string }>;
}

export default async function TaskDetailPage({ params }: Props) {
  const { id, taskId } = await params;

  const session = await verifySession();

  const projectDetails = await getProjectDetails(id);
  console.log("Project details", projectDetails);

  if (!projectDetails) {
    notFound();
  }

  const taskDetails = await getProjectTaskDetails(id, taskId);
  console.log("Task details", taskDetails);

  if (!taskDetails) {
    notFound();
  }

  const subtasks = await getTaskSubtasks(taskId);
  console.log("Subtasks", subtasks);

  return (
    <TaskDetailContent
      project={projectDetails}
      task={taskDetails}
      subtasks={subtasks}
    />
  );
}
