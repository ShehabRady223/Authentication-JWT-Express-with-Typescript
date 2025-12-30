import { Router } from "express";
import { getSessionController } from "../controllers/session.controller.js";


const sessionRouter = Router();

sessionRouter.get("/", getSessionController);
// sessionRouter.delete("/:id", deleteSessionController);

export default sessionRouter;