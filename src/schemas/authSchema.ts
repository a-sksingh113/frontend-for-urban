import { z } from "zod";

export const emailSchema = z
  .string()
  .min(1, "Email is required")
  .email("Invalid email address");

export const passwordRequired = z.string().min(1, "Password is required");
export const passwordMin6 = passwordRequired.min(
  6,
  "Password must be at least 6 characters"
);

// Final schemas
export const loginSchema = z.object({
  email: emailSchema,
  password: passwordRequired,
});

export const signupSchema = z.object({
  email: emailSchema,
  password: passwordMin6,
});

export const forgotSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

// Types (optional, handy for forms)
export type LoginForm = z.infer<typeof loginSchema>;
export type SignupForm = z.infer<typeof signupSchema>;
export type ForgotForm = z.infer<typeof forgotSchema>;
