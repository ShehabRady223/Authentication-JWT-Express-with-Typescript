import type { CookieOptions, Response } from "express"
import { fifteenMinFromNow, thirtyDaysFromNow } from "./date.js"
import { NODE_ENV } from "../constants/env.js"

const secure = NODE_ENV !== 'production'

const defaults: CookieOptions = {
    sameSite: "strict",
    httpOnly: true,
    secure
}

const getAccessTokenCookieOptions = (): CookieOptions => ({
    ...defaults,
    expires: fifteenMinFromNow()
})

export const getRefreshTokenCookieOptions = (): CookieOptions => ({
    ...defaults,
    expires: thirtyDaysFromNow(),
    path: 'auth/refresh'
});

type Params = {
    res: Response
    accessToken: string,
    refreshToken: string
}

export const setAuthCookies = ({ res, accessToken, refreshToken }: Params) =>
    res.cookie("accessToken", accessToken,getAccessTokenCookieOptions())
.cookie("refreshToken", refreshToken,getRefreshTokenCookieOptions())

