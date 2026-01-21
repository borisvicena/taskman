"use server";

import {
  SignupFormSchema,
  FormState,
  LogInFormSchema,
} from "@/lib/definitions";
import { redirect } from "next/navigation";
import { deleteSession } from "@/lib/session";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function signup(state: FormState, formData: FormData) {
  // Validate form fields
  const validatedFields = SignupFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, email, password } = validatedFields.data;

  try {
    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return {
        message: "An account with this email already exists",
      };
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({
      name,
      email,
      passwordHash,
    });

    console.log("User created successfully:", newUser._id);

    // Redirect to login page after successful signup
    redirect("/login");
  } catch (error) {
    console.error("Signup error:", error);

    // More detailed error message
    if (error instanceof Error) {
      return {
        message: `Signup failed: ${error.message}`,
      };
    }

    return {
      message: "Something went wrong. Please try again.",
    };
  }
}

export async function logout() {
  // Delete custom session if it exists
  await deleteSession();

  // Redirect to NextAuth signout which will clear NextAuth session
  redirect("/api/auth/signout");
}
