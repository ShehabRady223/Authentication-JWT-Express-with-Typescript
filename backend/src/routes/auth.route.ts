import { Router } from "express";
import {
    loginController,
    logoutController,
    refreshController,
    registerController,
    resetPasswordController,
    sendPasswordController,
    verifyEmailController
} from './../controllers/auth.controller.js';

const authRoute = Router();

authRoute.post("/register", registerController)
authRoute.post("/login", loginController)
authRoute.get("/refresh", refreshController)
authRoute.get("/logout", logoutController)
authRoute.get("/email/:code", verifyEmailController)
authRoute.post("/password/forgot", sendPasswordController)
authRoute.post("/password/reset", resetPasswordController)

export default authRoute