import jwt from "jsonwebtoken"
import VerificationCodeTypes from "../constants/verificationCodeTypes.js"
import SessionModel from "../models/session.model.js"
import UserModel from "../models/user.model.js"
import verificationCodeModel from "../models/verificationCode.model.js"
import { oneYearFromNow } from "../utils/date.js"
import { JWT_REFRESH_SECRET, JWT_SECRET } from "../constants/env.js"
import appAssert from "../utils/appAssert.js"
import { CONFLICT, UNAUTHORIZED } from "../constants/http.js"

type CreateAccountParams = {
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
    appAssert(!existUser, CONFLICT, "Email already in user")
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
    return { user: user.omitPassword(), accessToken, refreshToken }
}

type LoginParams = {
    email: string,
    password: string,
    userAgent?: string
}

export const loginUser = async ({ email, password, userAgent }: LoginParams) => {
    //get the user by email
    const user = await UserModel.findOne({ email })
    appAssert(user, UNAUTHORIZED, "Invalid email or password")
    //validate password from requset
    const isValid = await user.comparePassword(password)
    appAssert(isValid, UNAUTHORIZED, "Invalid email or password")
    const userId = user._id
    //create session
    const session = await SessionModel.create({
        userId,
        ...(userAgent && { userAgent })
    })
    const sessionInfo = {
        sesssionId: session._id
    }
    //sign access token & refresh token
    const refreshToken = jwt.sign(
        sessionInfo,
        JWT_REFRESH_SECRET, {
        audience: ["user"],
        expiresIn: "30d"
    })
    const accessToken = jwt.sign(
        {
            ...sessionInfo,
            sessionId: session._id
        },
        JWT_SECRET, {
        audience: ["user"],
        expiresIn: "12m"
    })
    //return user & token
    return { user: user.omitPassword(), accessToken, refreshToken }
}