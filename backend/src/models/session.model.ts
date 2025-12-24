import mongoose from 'mongoose';
import { thirtyDaysFromNow } from '../utils/date.js';

export interface Session {
    userId: mongoose.Types.ObjectId;
    userAgent?: string;
    createdAt: Date;
    expirtAt: Date;
}

const sessionSchema = new mongoose.Schema({
    userId: { type: mongoose.Types.ObjectId, ref: "User", index: true },
    userAgent: { type: String},
    createdAt: { type: Date, default: Date.now },
    expirtAt: { type: Date, default: thirtyDaysFromNow }
})

// const sessionSchema = new mongoose.Schema<Session>({
//     userId: { type: mongoose.Types.ObjectId, ref: "User", required: true, index: true },
//     userAgent: { type: String },
//     createdAt: { type: Date, default: Date.now },
//     expirtAt: { type: Date, default: thirtyDaysFromNow }
// });
// const SessionModel = mongoose.model<Session>("Session", sessionSchema)

const SessionModel = mongoose.model("Session", sessionSchema)
export default SessionModel;