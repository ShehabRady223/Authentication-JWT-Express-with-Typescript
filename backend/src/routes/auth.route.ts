import { Router } from "express";
import {
    loginController,
    logoutController,
    refreshController,
    registerController,
    verifyEmailController
} from './../controllers/auth.controller.js';

const authRoute = Router();

authRoute.post("/register", registerController)
authRoute.post("/login", loginController)
authRoute.get("/refresh", refreshController)
authRoute.get("/logout", logoutController)
authRoute.get("/email/:code", verifyEmailController)

export default authRoute