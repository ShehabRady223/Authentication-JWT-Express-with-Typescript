import catchError from "../utils/catchErrors.js";
import { createAccount, loginUser } from "../services/auth.service.js";
import { CREATED, OK } from "../constants/http.js";
import type { Response } from "express";
import { setAuthCookies } from "../utils/cookies.js";
import { registerSchema, loginSchema } from "./auth.Schemas.js";

export const registerController = catchError(async (req, res) => {
    const request = registerSchema.parse({
        ...req.body, userAgent: req.headers["user-agent"]
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

export const loginController = catchError(async (req, res) => {
    const request = loginSchema.parse({ ...req.body, userAgent: req.headers["user-agent"] });
    //call service
    const { accessToken, refreshToken } = await loginUser({
        email: request.email,
        password: request.password,
        ...(request.userAgent && { userAgent: request.userAgent })
    });
    return setAuthCookies({ res, accessToken, refreshToken })
        .status(OK)
        .json({ message: "Login successful" });
})