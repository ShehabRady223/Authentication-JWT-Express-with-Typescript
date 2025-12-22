import mongoose from "mongoose"
import { MONGO_URL } from './../constants/env.js';

export default async function connectToDatabase() {
    try {
        await mongoose.connect(MONGO_URL)
        console.log("Successfully connected to DB");
    } catch (error) {
        console.log("Could not connect to database", error);
        process.exit(1);
    }
}