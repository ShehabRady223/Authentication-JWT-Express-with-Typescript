import { z } from "zod";

const passwordSchema = z.string().min(6).max(15)

export const loginSchema = z.object({
    // email:z.string().email().min(1).max(255)
    email: z.email(),
    password: passwordSchema,
    userAgent: z.string().optional()
})

export const registerSchema = loginSchema.extend({
    confirmPassword: z.string().min(6).max(15),
}).refine(
    (data) => data.password === data.confirmPassword,
    {
        message: "Password do not match",
        path: ["confirmPassword"]
    }
)