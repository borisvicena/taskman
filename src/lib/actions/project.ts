"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { verifySession } from "@/lib/dal";
import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";
import Task from "@/models/Task";

// Create a new project
export async function createProject(prevState: any, formData: FormData) {
  const session = await verifySession();

  if (!session.isAuth) {
    return { message: "Unauthorized" };
  }

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const status = formData.get("status") as string;
  const dueDate = formData.get("dueDate") as string;

  // Validation
  if (!name || name.trim() === "") {
    return { errors: { name: ["Project name is required"] } };
  }

  try {
    await connectDB();

    const project = await Project.create({
      name: name.trim(),
      description: description?.trim() || "",
      status: status || "active",
      dueDate: dueDate ? new Date(dueDate) : null,
      ownerId: session.userId,
      members: [],
    });

    revalidatePath("/dashboard");
    return { success: true, projectId: project._id.toString() };
  } catch (error) {
    console.error("Failed to create project:", error);
    return { message: "Failed to create project" };
  }
}

// Update an existing project
export async function updateProject(projectId: string, formData: FormData) {
  const session = await verifySession();

  if (!session.isAuth) {
    return { error: "Unauthorized" };
  }

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const status = formData.get("status") as string;
  const dueDate = formData.get("dueDate") as string;

  // Validation
  if (!name || name.trim() === "") {
    return { error: "Project name is required" };
  }

  try {
    await connectDB();

    // Check if user owns the project
    const project = await Project.findById(projectId);

    if (!project) {
      return { error: "Project not found" };
    }

    if (project.ownerId.toString() !== session.userId) {
      return { error: "Unauthorized - You must be the project owner" };
    }

    // Update the project
    project.name = name.trim();
    project.description = description?.trim() || "";
    project.status = status || project.status;
    project.dueDate = dueDate ? new Date(dueDate) : project.dueDate;

    await project.save();

    revalidatePath("/dashboard");
    revalidatePath(`/dashboard/projects/${projectId}`);

    return { success: true };
  } catch (error) {
    console.error("Failed to update project:", error);
    return { error: "Failed to update project" };
  }
}

// Delete a project and all its tasks
export async function deleteProject(projectId: string) {
  const session = await verifySession();

  if (!session.isAuth) {
    return { error: "Unauthorized" };
  }

  try {
    await connectDB();

    // Check if user owns the project
    const project = await Project.findById(projectId);

    if (!project) {
      return { error: "Project not found" };
    }

    if (project.ownerId.toString() !== session.userId) {
      return { error: "Unauthorized - You must be the project owner" };
    }

    // Delete all tasks associated with this project
    await Task.deleteMany({ projectId });

    // Delete the project
    await Project.findByIdAndDelete(projectId);

    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Failed to delete project:", error);
    return { error: "Failed to delete project" };
  }
}

// Add a member to a project (by email)
export async function addProjectMember(projectId: string, emailOrUserId: string, role: "editor" | "viewer" = "viewer") {
  const session = await verifySession();

  if (!session.isAuth) {
    return { error: "Unauthorized" };
  }

  try {
    await connectDB();

    const project = await Project.findById(projectId);

    if (!project) {
      return { error: "Project not found" };
    }

    // Only owner can add members
    if (project.ownerId.toString() !== session.userId) {
      return { error: "Unauthorized - Only project owner can add members" };
    }

    // Look up user by email or userId
    let userId = emailOrUserId;

    // If it looks like an email, find the user
    if (emailOrUserId.includes("@")) {
      const User = (await import("@/models/User")).default;
      const user = await User.findOne({ email: emailOrUserId });

      if (!user) {
        return { error: "User not found. They must have an account first." };
      }

      userId = user._id.toString();
    }

    // Don't add owner as a member
    if (userId === project.ownerId.toString()) {
      return { error: "Project owner cannot be added as a member" };
    }

    // Check if member already exists
    const existingMember = project.members.find(
      (m: any) => m.userId.toString() === userId
    );

    if (existingMember) {
      return { error: "User is already a member of this project" };
    }

    // Add the member
    project.members.push({ userId, role });
    await project.save();

    revalidatePath(`/dashboard/projects/${projectId}`);

    return { success: true };
  } catch (error) {
    console.error("Failed to add project member:", error);
    return { error: "Failed to add member" };
  }
}

// Remove a member from a project
export async function removeProjectMember(projectId: string, userId: string) {
  const session = await verifySession();

  if (!session.isAuth) {
    return { error: "Unauthorized" };
  }

  try {
    await connectDB();

    const project = await Project.findById(projectId);

    if (!project) {
      return { error: "Project not found" };
    }

    // Only owner can remove members
    if (project.ownerId.toString() !== session.userId) {
      return { error: "Unauthorized - Only project owner can remove members" };
    }

    // Remove the member
    project.members = project.members.filter(
      (m: any) => m.userId.toString() !== userId
    );

    await project.save();

    revalidatePath(`/dashboard/projects/${projectId}`);

    return { success: true };
  } catch (error) {
    console.error("Failed to remove project member:", error);
    return { error: "Failed to remove member" };
  }
}

// Update member role
export async function updateMemberRole(projectId: string, userId: string, role: "editor" | "viewer") {
  const session = await verifySession();

  if (!session.isAuth) {
    return { error: "Unauthorized" };
  }

  try {
    await connectDB();

    const project = await Project.findById(projectId);

    if (!project) {
      return { error: "Project not found" };
    }

    // Only owner can update roles
    if (project.ownerId.toString() !== session.userId) {
      return { error: "Unauthorized - Only project owner can update roles" };
    }

    // Find and update the member
    const member = project.members.find(
      (m: any) => m.userId.toString() === userId
    );

    if (!member) {
      return { error: "Member not found" };
    }

    member.role = role;
    await project.save();

    revalidatePath(`/dashboard/projects/${projectId}`);

    return { success: true };
  } catch (error) {
    console.error("Failed to update member role:", error);
    return { error: "Failed to update role" };
  }
}
