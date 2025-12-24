import mongoose from "mongoose";
import VerificationCodeTypes from "../constants/verificationCodeTypes.js";

export interface VerificationCodeDocumnet extends mongoose.Document {
    userId: mongoose.Types.ObjectId;
    type: VerificationCodeTypes;
    expiresAt: Date;
    createAt: Date;
}

const verificationCodeSchema = new mongoose.Schema<VerificationCodeDocumnet>({
    userId: { type: mongoose.Types.ObjectId, ref: "User", required: true, index: true },
    type: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    createAt: { type: Date, required: true, default: Date.now }
})

const verificationCodeModel = mongoose.model<VerificationCodeDocumnet>(
    'VerficationCode',
    verificationCodeSchema,
    'verfication_codes'
);

export default verificationCodeModel