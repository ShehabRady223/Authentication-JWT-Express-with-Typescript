import { Router } from "express";
import { getUserController } from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.get("/", getUserController);

export default userRouter;