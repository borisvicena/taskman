import "server-only";

import { cache } from "react";
import { getServerAuthSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Project from "@/models/Project";
import Task from "@/models/Task";
import { redirect } from "next/navigation";

export const verifySession = cache(async () => {
  const session = await getServerAuthSession();

  if (!session?.user?.id) {
    return { isAuth: false };
  }

  return {
    isAuth: true,
    userId: session.user.id,
  };
});

export const getUserData = cache(async () => {
  const session = await verifySession();

  if (!session.isAuth) return null;

  try {
    await connectDB();
    const user = await User.findById(session.userId).select("-passwordHash").lean();

    if (!user) return null;

    return {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      googleId: user.googleId || "",
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      googleLinked: !!user.googleId,
    };
  } catch (error) {
    console.error("Failed to fetch user", error);
    return null;
  }
});

export const getProjects = cache(async () => {
  const session = await verifySession();

  if (!session.isAuth) {
    redirect("/login");
  }

  try {
    await connectDB();

    // Get projects where user is owner or member
    const projects = await Project.find({
      $or: [
        { ownerId: session.userId },
        { "members.userId": session.userId }
      ]
    })
    .populate("ownerId", "name email")
    .populate("members.userId", "name email")
    .sort({ updatedAt: -1 })
    .lean();

    // Get task stats for each project
    const projectIds = projects.map((p) => p._id);

    const taskStats = await Task.aggregate([
      { $match: { projectId: { $in: projectIds } } },
      {
        $group: {
          _id: "$projectId",
          totalTasks: { $sum: 1 },
          completedTasks: {
            $sum: { $cond: [{ $eq: ["$status", "done"] }, 1, 0] },
          },
        },
      },
    ]);

    // Create a map for quick lookup
    const taskStatsMap = new Map(
      taskStats.map((stat) => [stat._id.toString(), stat])
    );

    return projects.map((project) => {
      const stats = taskStatsMap.get(project._id.toString());

      return {
        _id: project._id.toString(),
        name: project.name,
        description: project.description,
        status: project.status,
        dueDate: project.dueDate || null,
        ownerId: project.ownerId._id.toString(),
        members: project.members.map((member: any) => ({
          userId: member.userId._id.toString(),
          role: member.role,
        })),
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
        totalTasks: stats?.totalTasks || 0,
        completedTasks: stats?.completedTasks || 0,
      };
    });
  } catch (error) {
    console.error("Failed to get projects", error);
    return [];
  }
});

export const getProjectDetails = cache(async (projectId: string) => {
  const session = await verifySession();

  if (!session.isAuth) {
    redirect("/login");
  }

  try {
    await connectDB();

    const project = await Project.findById(projectId)
      .populate("ownerId", "name email")
      .populate("members.userId", "name email")
      .lean();

    if (!project) return null;

    // Check if user has access to this project
    const hasAccess =
      project.ownerId._id.toString() === session.userId ||
      project.members.some((member: any) => member.userId._id.toString() === session.userId);

    if (!hasAccess) return null;

    return {
      _id: project._id.toString(),
      name: project.name,
      description: project.description,
      status: project.status,
      dueDate: project.dueDate || null,
      ownerId: project.ownerId._id.toString(),
      ownerName: project.ownerId.name,
      ownerEmail: project.ownerId.email,
      members: project.members.map((member: any) => ({
        userId: member.userId._id.toString(),
        userName: member.userId.name,
        userEmail: member.userId.email,
        role: member.role,
      })),
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    };
  } catch (error) {
    console.error("Failed to get project details", error);
    return null;
  }
});

export const getProjectDetailsWithTasks = cache(async (projectId: string) => {
  const session = await verifySession();

  if (!session.isAuth) {
    redirect("/login");
  }

  try {
    await connectDB();

    const project = await getProjectDetails(projectId);
    if (!project) return null;

    const tasks = await Task.find({ projectId })
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 })
      .lean();

    return {
      ...project,
      tasks: tasks.map((task) => ({
        _id: task._id.toString(),
        projectId: task.projectId.toString(),
        parentTaskId: task.parentTaskId ? task.parentTaskId.toString() : "",
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        assignedTo: task.assignedTo || undefined,
        dueDate: task.dueDate,
        comments: (task.comments || []).map((comment: any) => ({
          _id: comment._id.toString(),
          authorId: comment.authorId.toString(),
          content: comment.content,
          createdAt: comment.createdAt.toISOString(),
        })),
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
      })),
    };
  } catch (error) {
    console.error("Failed to get project details with tasks", error);
    return null;
  }
});

export const getProjectTaskDetails = cache(
  async (projectId: string, taskId: string) => {
    const session = await verifySession();

    if (!session.isAuth) {
      redirect("/login");
    }

    try {
      await connectDB();

      // First verify user has access to the project
      const project = await getProjectDetails(projectId);
      if (!project) return null;

      const task = await Task.findById(taskId)
        .populate("assignedTo", "name email")
        .populate("comments.authorId", "name email")
        .lean();

      if (!task || task.projectId.toString() !== projectId) {
        return null;
      }

      return {
        _id: task._id.toString(),
        projectId: task.projectId.toString(),
        parentTaskId: task.parentTaskId ? task.parentTaskId.toString() : "",
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        assignedTo: task.assignedTo,
        dueDate: task.dueDate,
        comments: task.comments.map((comment: any) => ({
          _id: comment._id.toString(),
          authorId: comment.authorId._id.toString(),
          authorName: comment.authorId.name || "Unknown User",
          authorEmail: comment.authorId.email || "",
          content: comment.content,
          createdAt: comment.createdAt.toISOString(),
        })),
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
      };
    } catch (error) {
      console.error("Failed to get project task details", error);
      return null;
    }
  },
);

export const getTaskSubtasks = cache(async (taskId: string) => {
  const session = await verifySession();

  if (!session.isAuth) {
    redirect("/login");
  }

  try {
    await connectDB();

    // Get all subtasks where parentTaskId matches the current task
    const subtasks = await Task.find({ parentTaskId: taskId })
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 })
      .lean();

    return subtasks.map((task) => ({
      _id: task._id.toString(),
      projectId: task.projectId.toString(),
      parentTaskId: task.parentTaskId ? task.parentTaskId.toString() : "",
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      assignedTo: task.assignedTo || undefined,
      dueDate: task.dueDate,
      comments: (task.comments || []).map((comment: any) => ({
        _id: comment._id.toString(),
        authorId: comment.authorId.toString(),
        content: comment.content,
        createdAt: comment.createdAt.toISOString(),
      })),
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    }));
  } catch (error) {
    console.error("Failed to get task subtasks", error);
    return [];
  }
});
