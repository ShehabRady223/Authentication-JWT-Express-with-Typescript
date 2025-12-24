import jwt from "jsonwebtoken"
import VerificationCodeTypes from "../constants/verificationCodeTypes.js"
import SessionModel from "../models/session.model.js"
import UserModel from "../models/user.model.js"
import verificationCodeModel from "../models/verificationCode.model.js"
import { oneYearFromNow } from "../utils/date.js"
import { JWT_REFRESH_SECRET, JWT_SECRET } from "../constants/env.js"

export type CreateAccountParams = {
    email: string,
    password: string,
    confirmPassword: string,
    userAgent?: string
}
//!
export async function createAccount(data: CreateAccountParams) {
    //verfiy existing user does not exist
    const existUser = await UserModel.exists({
        email: data.email
    })
    if (existUser) {
        throw new Error("User already exists")
    }
    //creat user 
    const user = await UserModel.create({
        email: data.email,
        password: data.password
    })
    //create verfication code
    const verficationCode = await verificationCodeModel.create({
        userId: user._id,
        type: VerificationCodeTypes.EmailVerification,
        expiresAt: oneYearFromNow()
    })
    //creat Session
    const session = await SessionModel.create({
        userId: user._id,
        ...(data.userAgent && { userAgent: data.userAgent })
    });
    //sign access token & refresh token
    const refreshToken = jwt.sign(
        { sessionId: session._id },
        JWT_REFRESH_SECRET, {
        audience: ["user"],
        expiresIn: "30d"
    })
    const accessToken = jwt.sign(
        {
            userId: user._id,
            sessionId: session._id
        },
        JWT_SECRET, {
        audience: ["user"],
        expiresIn: "12m"
    })
    return {user,accessToken,refreshToken}
}