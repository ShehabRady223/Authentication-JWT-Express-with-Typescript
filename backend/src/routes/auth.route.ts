import { Router } from "express";
import { registerController } from './../controllers/auth.controller.js';

const authRoute = Router();

authRoute.post("/register", registerController)

export default authRoute