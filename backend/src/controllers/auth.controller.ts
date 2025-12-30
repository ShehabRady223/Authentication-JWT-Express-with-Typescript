import catchError from "../utils/catchErrors.js";
import { createAccount, loginUser, refreshUserAccessToken, resetPassword, sendPasswordResetEmail, verifyEmail } from "../services/auth.service.js";
import { CREATED, OK, UNAUTHORIZED } from "../constants/http.js";
import type { Response } from "express";
import { clearAuthCookies, getRefreshTokenCookieOptions, setAuthCookies } from "../utils/cookies.js";
import { registerSchema, loginSchema, verificationCodeSchema, emailSchema, resetPasswordSchema } from "./auth.Schemas.js";
import { verifyToken } from "../utils/jwt.js";
import sessionModel from "../models/session.model.js";
import appAssert from "../utils/appAssert.js";

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

export const logoutController = catchError(async (req, res) => {
    const accessToken = req.cookies.accessToken;
    const { payload } = verifyToken(accessToken)
    if (payload) {
        await sessionModel.findByIdAndDelete(payload.sessionId);
    }
    return clearAuthCookies(res).status(OK).json({ message: "Logout successful" })
})

export const refreshController = catchError(async (req, res) => {
    const refreshToken = req.cookies.refreshToken as string | undefined;
    appAssert(refreshToken, UNAUTHORIZED, "Missing refresh token");
    const { accessToken, newRefreshToken } = await refreshUserAccessToken(refreshToken);
    if (newRefreshToken) {
        res.cookie("refreshToken", newRefreshToken, getRefreshTokenCookieOptions());
    }
    return res
        .status(OK)
        .cookie("accessToken", accessToken, getRefreshTokenCookieOptions())
        .json({ message: "Access token refreshed" });
});

export const verifyEmailController = catchError(async (req, res) => {
    const verificationCode = verificationCodeSchema.parse(req.params.code)
    await verifyEmail(verificationCode)
    return res.status(OK).json({ message: "Email verified successfully" });
})

export const sendPasswordController = catchError(async (req, res) => {
    const email = emailSchema.parse(req.body.email);
    await sendPasswordResetEmail(email);
    return res.status(OK).json({ message: "Password reset email sent" });
})

export const resetPasswordController = catchError(async (req, res) => {
    const { password, verificationCode } = resetPasswordSchema.parse(req.body)
    await resetPassword({ password, verificationCode })
    return clearAuthCookies(res).status(OK).json({ message: "Password reset successful" });
})