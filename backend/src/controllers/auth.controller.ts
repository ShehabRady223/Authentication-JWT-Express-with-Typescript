import z from "zod";
import catchError from "../utils/catchErrors.js";
import { createAccount } from "../services/auth.service.js";
import { CREATED } from "../constants/http.js";
import type { Response } from "express";
import { setAuthCookies } from "../utils/cookies.js";

const registerSchema = z.object({
    // email:z.string().email().min(1).max(255)
    email: z.email(),
    password: z.string().min(6).max(15),
    confirmPassword: z.string().min(6).max(15),
    userAgent: z.string().optional()
}).refine(
    (data) => data.password === data.confirmPassword,
    {
        message: "Password do not match",
        path: ["confirmPassword"]
    }
)

export const registerController = catchError(async (req, res) => {
    const request = registerSchema.parse({
        ...req.body, userAgent: req.headers["user-agent"],
    })
    //call service 
    const { user, accessToken, refreshToken } = await createAccount({
        email: request.email,
        password: request.password,
        confirmPassword: request.confirmPassword,
        ...(request.userAgent && { userAgent: request.userAgent })
    });
    return setAuthCookies({ res, accessToken, refreshToken }).
        status(CREATED)
        .json(user);
});