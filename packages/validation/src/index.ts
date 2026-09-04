import { z } from "zod";

export const usernameRule = z.string()
  .min(3, "At least 3 characters required for username")
  .max(50, "Username cannot exceed 50 characters");

export const passwordRule = z.string()
  .min(6, "At least 6 characters required for password")
  .max(50, "Password cannot exceed 50 characters");

export const emailRule = z.string().email("Invalid email address");

export const roleRule = z.enum(["client","freelancer"],{
  message:"Role must be client or freelancer"
})

export const signup_schema = z.object({
  name: z.string().min(3, "At least 3 characters required for name").max(50),
  username: usernameRule,
  email: emailRule,
  password: passwordRule,
  role:roleRule
});

export const login_schema = z.object({
  loginIdentifier: z.string().min(1, "Username or email is required"),
  password: passwordRule,
});

export type SignupInput = z.infer<typeof signup_schema>;
export type LoginInput = z.infer<typeof login_schema>;

export * from "./project.js"
export * from "./proposal.js"