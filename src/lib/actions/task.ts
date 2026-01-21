"use server";

import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/dal";
import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";
import Task from "@/models/Task";

// Create a new task
export async function createTask(projectId: string, formData: FormData) {
  const session = await verifySession();

  if (!session.isAuth) {
    return { error: "Unauthorized" };
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const status = formData.get("status") as string;
  const priority = formData.get("priority") as string;
  const assignedTo = formData.get("assignedTo") as string;
  const parentTaskId = formData.get("parentTaskId") as string;
  const dueDate = formData.get("dueDate") as string;

  // Validation
  if (!title || title.trim() === "") {
    return { error: "Task title is required" };
  }

  try {
    await connectDB();

    // Verify user has access to this project
    const project = await Project.findById(projectId);

    if (!project) {
      return { error: "Project not found" };
    }

    const isOwner = project.ownerId.toString() === session.userId;
    const isMember = project.members.some(
      (m: any) => m.userId.toString() === session.userId
    );

    if (!isOwner && !isMember) {
      return { error: "Unauthorized - You don't have access to this project" };
    }

    // Check if member is viewer (viewers can't create tasks)
    if (!isOwner) {
      const member = project.members.find(
        (m: any) => m.userId.toString() === session.userId
      );
      if (member && member.role === "viewer") {
        return { error: "Viewers cannot create tasks" };
      }
    }

    // Create the task
    const task = await Task.create({
      projectId,
      title: title.trim(),
      description: description?.trim() || "",
      status: status || "todo",
      priority: priority || "medium",
      assignedTo: assignedTo || null,
      parentTaskId: parentTaskId || null,
      dueDate: dueDate ? new Date(dueDate) : null,
      comments: [],
    });

    revalidatePath("/dashboard");
    revalidatePath(`/dashboard/projects/${projectId}`);

    return { success: true, taskId: task._id.toString() };
  } catch (error) {
    console.error("Failed to create task:", error);
    return { error: "Failed to create task" };
  }
}

// Update an existing task
export async function updateTask(taskId: string, formData: FormData) {
  const session = await verifySession();

  if (!session.isAuth) {
    return { error: "Unauthorized" };
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const status = formData.get("status") as string;
  const priority = formData.get("priority") as string;
  const assignedTo = formData.get("assignedTo") as string;
  const dueDate = formData.get("dueDate") as string;

  try {
    await connectDB();

    const task = await Task.findById(taskId);

    if (!task) {
      return { error: "Task not found" };
    }

    // Verify user has access to this project
    const project = await Project.findById(task.projectId);

    if (!project) {
      return { error: "Project not found" };
    }

    const isOwner = project.ownerId.toString() === session.userId;
    const isMember = project.members.some(
      (m: any) => m.userId.toString() === session.userId
    );

    if (!isOwner && !isMember) {
      return { error: "Unauthorized - You don't have access to this project" };
    }

    // Check if member is viewer
    if (!isOwner) {
      const member = project.members.find(
        (m: any) => m.userId.toString() === session.userId
      );
      if (member && member.role === "viewer") {
        return { error: "Viewers cannot update tasks" };
      }
    }

    // Update the task
    if (title && title.trim() !== "") {
      task.title = title.trim();
    }
    if (description !== undefined) {
      task.description = description?.trim() || "";
    }
    if (status) {
      task.status = status;
    }
    if (priority) {
      task.priority = priority;
    }
    if (assignedTo !== undefined) {
      task.assignedTo = assignedTo || null;
    }
    if (dueDate !== undefined) {
      task.dueDate = dueDate ? new Date(dueDate) : null;
    }

    await task.save();

    revalidatePath("/dashboard");
    revalidatePath(`/dashboard/projects/${task.projectId}`);
    revalidatePath(`/dashboard/projects/${task.projectId}/tasks/${taskId}`);

    return { success: true };
  } catch (error) {
    console.error("Failed to update task:", error);
    return { error: "Failed to update task" };
  }
}

// Delete a task
export async function deleteTask(taskId: string) {
  const session = await verifySession();

  if (!session.isAuth) {
    return { error: "Unauthorized" };
  }

  try {
    await connectDB();

    const task = await Task.findById(taskId);

    if (!task) {
      return { error: "Task not found" };
    }

    // Verify user has access to this project
    const project = await Project.findById(task.projectId);

    if (!project) {
      return { error: "Project not found" };
    }

    const isOwner = project.ownerId.toString() === session.userId;
    const isMember = project.members.some(
      (m: any) => m.userId.toString() === session.userId
    );

    if (!isOwner && !isMember) {
      return { error: "Unauthorized - You don't have access to this project" };
    }

    // Check if member is viewer
    if (!isOwner) {
      const member = project.members.find(
        (m: any) => m.userId.toString() === session.userId
      );
      if (member && member.role === "viewer") {
        return { error: "Viewers cannot delete tasks" };
      }
    }

    const projectId = task.projectId;

    // Delete the task
    await Task.findByIdAndDelete(taskId);

    revalidatePath("/dashboard");
    revalidatePath(`/dashboard/projects/${projectId}`);

    return { success: true };
  } catch (error) {
    console.error("Failed to delete task:", error);
    return { error: "Failed to delete task" };
  }
}

// Add a comment to a task
export async function addTaskComment(taskId: string, content: string) {
  const session = await verifySession();

  if (!session.isAuth) {
    return { error: "Unauthorized" };
  }

  if (!content || content.trim() === "") {
    return { error: "Comment content is required" };
  }

  try {
    await connectDB();

    const task = await Task.findById(taskId);

    if (!task) {
      return { error: "Task not found" };
    }

    // Verify user has access to this project
    const project = await Project.findById(task.projectId);

    if (!project) {
      return { error: "Project not found" };
    }

    const isOwner = project.ownerId.toString() === session.userId;
    const isMember = project.members.some(
      (m: any) => m.userId.toString() === session.userId
    );

    if (!isOwner && !isMember) {
      return { error: "Unauthorized - You don't have access to this project" };
    }

    // Add the comment
    task.comments.push({
      authorId: session.userId,
      content: content.trim(),
      createdAt: new Date(),
    });

    await task.save();

    revalidatePath(`/dashboard/projects/${task.projectId}/tasks/${taskId}`);

    return { success: true };
  } catch (error) {
    console.error("Failed to add comment:", error);
    return { error: "Failed to add comment" };
  }
}

// Delete a comment from a task
export async function deleteTaskComment(taskId: string, commentId: string) {
  const session = await verifySession();

  if (!session.isAuth) {
    return { error: "Unauthorized" };
  }

  try {
    await connectDB();

    const task = await Task.findById(taskId);

    if (!task) {
      return { error: "Task not found" };
    }

    // Find the comment
    const comment = task.comments.find(
      (c: any) => c._id.toString() === commentId
    );

    if (!comment) {
      return { error: "Comment not found" };
    }

    // Only comment author or project owner can delete
    const project = await Project.findById(task.projectId);
    const isProjectOwner = project?.ownerId.toString() === session.userId;
    const isCommentAuthor = comment.authorId.toString() === session.userId;

    if (!isProjectOwner && !isCommentAuthor) {
      return { error: "Unauthorized - Only comment author or project owner can delete comments" };
    }

    // Remove the comment
    task.comments = task.comments.filter(
      (c: any) => c._id.toString() !== commentId
    );

    await task.save();

    revalidatePath(`/dashboard/projects/${task.projectId}/tasks/${taskId}`);

    return { success: true };
  } catch (error) {
    console.error("Failed to delete comment:", error);
    return { error: "Failed to delete comment" };
  }
}
