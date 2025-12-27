import { Router } from "express";
import { loginController, logoutController, registerController } from './../controllers/auth.controller.js';

const authRoute = Router();

authRoute.post("/register", registerController)
authRoute.post("/login", loginController)
authRoute.get("/logout", logoutController)

export default authRoute