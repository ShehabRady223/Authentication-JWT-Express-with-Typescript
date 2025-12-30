import z from "zod";
import { NOT_FOUND, OK } from "../constants/http.js";
import SessionModel from "../models/session.model.js";
import catchError from "../utils/catchErrors.js";
import appAssert from "../utils/appAssert.js";

export const getSessionController = catchError(async (req, res) => {
    const sessions = await SessionModel.find({
        user: req.userId, expiredAt: { $gt: new Date() }
    },
        {
            _id: 1, userAgent: 1, createdAt: 1
        },
        {
            sort: { createAt: -1 }
        }
    );
    res.status(OK).json(sessions.map(session => ({
        ...session.toObject(),
        ...(session._id === req.sessionId && { isCurrent: true })
    })))
})

export const deleteSessionController = catchError(async (req, res) => {
    const sessionId = z.string().parse(req.params.id);
    const deleted = await SessionModel.deleteOne({ _id: sessionId, user: req.userId });
    appAssert(deleted,NOT_FOUND,"Session not found")
    res.sendStatus(OK).json({message:"Session deleted successfully"});
})