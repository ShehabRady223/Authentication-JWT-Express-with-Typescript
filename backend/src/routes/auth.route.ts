import { Router } from "express";
import {
    loginController,
    logoutController,
    refreshController,
    registerController
} from './../controllers/auth.controller.js';

const authRoute = Router();

authRoute.post("/register", registerController)
authRoute.post("/login", loginController)
authRoute.get("/refresh", refreshController)
authRoute.get("/logout", logoutController)

export default authRoute