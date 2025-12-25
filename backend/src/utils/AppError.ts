import type { HttpStatusCode } from "../constants/http.js";
import AppErrorCode from './../constants/appErrorCode.js';

class AppError extends Error {
    constructor(public statusCode: HttpStatusCode, public message: string, public errorCode?: AppErrorCode) {
        super(message);
    }
}

new AppError(200,"msg")

export default AppError