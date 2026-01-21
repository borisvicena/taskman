import * as z from "zod";

export const SignupFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }).trim(),
  email: z.string().email({ message: "Please enter a valid email" }).trim(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[a-zA-Z]/, { message: "Password must contain at least one letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .trim(),
});

export const LogInFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email" }).trim(),
  password: z.string().min(1, { message: "Password is required" }).trim(),
});

export type FormState =
  | {
      errors?: {
        name?: string[];
        email?: string[];
        password?: string[];
      };
      message?: string;
    }
  | undefined;

export type SessionPayload = {
  userId: string;
  accessToken: string;
  expiresAt: Date;
};
