import VerificationCodeTypes from "../constants/verificationCodeTypes.js"
import SessionModel from "../models/session.model.js"
import UserModel from "../models/user.model.js"
import verificationCodeModel from "../models/verificationCode.model.js"
import { ONE_DAY_MS, oneYearFromNow, thirtyDaysFromNow } from "../utils/date.js"
import appAssert from "../utils/appAssert.js"
import { CONFLICT, UNAUTHORIZED } from "../constants/http.js"
import { signToken, verifyToken, type RefreshTokenPayload } from "../utils/jwt.js"
import { refreshTokenSignOptions } from './../utils/jwt.js';

type CreateAccountParams = {
    email: string,
    password: string,
    confirmPassword: string,
    userAgent?: string
}

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
    const userId = user._id
    //create verfication code
    const verficationCode = await verificationCodeModel.create({
        userId,
        type: VerificationCodeTypes.EmailVerification,
        expiresAt: oneYearFromNow()
    })
    //creat Session
    const session = await SessionModel.create({
        userId,
        ...(data.userAgent && { userAgent: data.userAgent })
    });
    //sign access token & refresh token
    const refreshToken = signToken({ sessionId: session._id }, refreshTokenSignOptions)
    const accessToken = signToken({ userId, sessionId: session._id })
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
    const sessionInfo = { sessionId: session._id }
    //sign access token & refresh token
    const refreshToken = signToken(sessionInfo, refreshTokenSignOptions)
    const accessToken = signToken({ ...sessionInfo, userId })
    //return user & token
    return { user: user.omitPassword(), accessToken, refreshToken }
}

export const refreshUserAccessToken = async (refreshToken: string) => {
    const { payload } = verifyToken<RefreshTokenPayload>(refreshToken, { secret: refreshTokenSignOptions.secret });
    appAssert(payload, UNAUTHORIZED, "Invalid refresh token");
    const session = await SessionModel.findById(payload.sessionId);
    const now = Date.now();
    appAssert(session && session.expiresAt.getTime() > now, UNAUTHORIZED, "Session expired");
    // refresh the session if it expires in the next 24hrs
    const sessionNeedsRefresh = session.expiresAt.getTime() - now <= ONE_DAY_MS;
    if (sessionNeedsRefresh) {
        session.expiresAt = thirtyDaysFromNow();
        await session.save();
    }
    const newRefreshToken =
        sessionNeedsRefresh ? signToken({ sessionId: session._id, }, refreshTokenSignOptions) : undefined;
    const accessToken = signToken({ userId: session.userId, sessionId: session._id });
    return { accessToken, newRefreshToken, };
};