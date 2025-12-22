import "dotenv/config"
import express from "express";
import connectToDatabase from "./config/db.js";
import { APP_ORGIN, PORT } from "./constants/env.js";
import cors from "cors"
import cookieParser from "cookie-parser";
import errorHandler from "./middleware/errorHandler.js";

const app = express();

//Middilewares
app.use(express.json())
app.use(cors({
    origin:APP_ORGIN,
    credentials:true
}))
app.use(cookieParser())

//Routers
// app.get('/')

//Error Exapction
app.use(errorHandler)

//Running App
app.listen(PORT, async () => {
    console.log("Server Working Good!!");
    await connectToDatabase()
})