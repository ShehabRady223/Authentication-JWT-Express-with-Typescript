import UserModel from "../models/user.model.js"

export type CreateAccountParams = {
    email:string,
    password:string,
    confirmPassword:string,
    userAgent?:string
}
//!
export async function createAccount(data:CreateAccountParams){
    const existUser = await UserModel.exists({
        email:data.email
    })
    if(existUser){
        throw new Error("User already exists")
    }
    const user = await UserModel.create({
        email:data.email,
        password:data.password
    })
}