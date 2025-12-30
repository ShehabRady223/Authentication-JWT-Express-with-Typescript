import { Router } from "express";
import {
    loginController,
    logoutController,
    refreshController,
    registerController,
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

export default authRoute