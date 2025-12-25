import assert from "node:assert";
import AppError from "./AppError.js";
import type { HttpStatusCode } from "../constants/http.js";
import type AppErrorCode from "../constants/appErrorCode.js";

/**
* Assert a condition and throw an AppError if condition is falsy.
*/

type AppAssert =
    (condition: any,
        httpStatusCode: HttpStatusCode,
        message: string,
        appErrorCode?: AppErrorCode) => asserts condition

const appAssert: AppAssert = (condition: any, httpStatusCode, message, appErrorCode) =>
    assert(condition, new AppError(httpStatusCode, message, appErrorCode));

export default appAssert