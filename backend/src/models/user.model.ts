import mongoose from "mongoose"
import { compareValue, hashValue } from "../utils/bcrypt.js"

export interface UserDocument extends mongoose.Document {
    email: string,
    password: string,
    verified: boolean,
    createAt: Date,
    updateAt: Date,
    comparePassword(val: string): Promise<boolean>,
    omitPassword(): Pick<UserDocument, "_id" | "email" | "verified" | "createAt" | "updateAt">
}

const userSchema = new mongoose.Schema<UserDocument>({
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    verified: { type: Boolean, default: false }
},
    {
        timestamps: true
    })

userSchema.pre('save', async function () {
    if (!this.isModified("password")) {
        return
    }
    this.password = await hashValue(this.password, 8);
})

userSchema.methods.omitPassword = function () {
    const user = this.toObject();
    delete user.password;
    return user;
}

userSchema.methods.comparePassword = async function (val: string) {
    return compareValue(val, this.password)
}

const UserModel = mongoose.model<UserDocument>("User", userSchema)
export default UserModel