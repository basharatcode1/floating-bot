import { z } from "zod";
 
export const loginSchema = z.object({
  email: z
    .string({ message: "Email is required" })
    .trim()
    .min(1, "Email is required")
    .email("Invalid email address")
    .transform((val) => val.toLowerCase()),
  password: z
    .string({ message: "Password is required" })
    .min(1, "Password is required"),
});
 
export type LoginFormData = z.infer<typeof loginSchema>;
// Kept for backward compatibility with GlassLoginCard.tsx
export type LoginData = z.infer<typeof loginSchema>;
