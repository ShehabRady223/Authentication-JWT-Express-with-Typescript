import jwt from "jsonwebtoken";
import permissions from "../constants/permissions.js";
import { JWT_REFRESH_SECRET, JWT_SECRET } from "../constants/env.js";
import type { VerifyOptions, SignOptions } from "jsonwebtoken"
import type { SessionDocument } from "../models/session.model.js";
import type { UserDocument } from './../models/user.model.js';

export type RefreshTokenPayload = {
    sessionId: SessionDocument["_id"];
};

export type AccessTokenPayload = {
    userId: UserDocument["_id"];
    sessionId: SessionDocument["_id"];
};

type SignOptionsAndSecret = SignOptions & {
    secret: string;
};

const signDefaults: SignOptions = {
    audience: permissions.User,
};

const verifyDefaults: VerifyOptions = {
    audience: permissions.User,
};

const accessTokenSignOptions: SignOptionsAndSecret = {
    expiresIn: "15m",
    secret: JWT_SECRET,
};

export const refreshTokenSignOptions: SignOptionsAndSecret = {
    expiresIn: "30d",
    secret: JWT_REFRESH_SECRET,
};

export const signToken =
    (payload: AccessTokenPayload | RefreshTokenPayload, options?: SignOptionsAndSecret) => {
        const { secret, ...signOpts } = options || accessTokenSignOptions;
        return jwt.sign(payload, secret, {...signDefaults,...signOpts,});
    };

export const verifyToken = <TPayload extends object = AccessTokenPayload>
    (token: string, options?: VerifyOptions & { secret?: string; }) => {
    const { secret = JWT_SECRET, ...verifyOpts } = options || {};
    try {
        const payload = jwt.verify(token, secret, { ...verifyDefaults, ...verifyOpts, }) as TPayload;
        return { payload };
        //? why is error should be of any type ?
    } catch (error: any) {
        return { error: error.message };
    }
};