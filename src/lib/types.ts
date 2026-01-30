// Types for TaskMan Project Management System

export type ProjectStatus = "active" | "on-hold" | "done";
export type ProjectFilter = "All" | ProjectStatus;
export type TaskStatus = "todo" | "in-progress" | "done";
export type TaskPriority = "low" | "medium" | "high";

export interface User {
  _id: string;
  name: string;
  email: string;
  googleId: string;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
  googleLinked: boolean;
}

export interface Comment {
  _id: string;
  authorId: string;
  authorName?: string;
  authorEmail?: string;
  content: string;
  createdAt: string;
}

export interface Member {
  userId: string;
  userName?: string;
  userEmail?: string;
  role: string;
}

export interface Project {
  _id: string;
  name: string;
  description: string;
  ownerId: string;
  ownerName?: string;
  ownerEmail?: string;
  members: Member[];
  status: ProjectStatus;
  dueDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
  totalTasks?: number;
  completedTasks?: number;
}

export interface Task {
  _id: string;
  projectId: string;
  parentTaskId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignedTo?: User;
  dueDate?: Date;
  comments: Comment[];
  createdAt: Date;
  updatedAt: Date;
}
