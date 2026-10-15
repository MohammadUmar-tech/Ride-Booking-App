import { userModel } from "../models/user.model.js";


export const userCreate=async ({email,fullName,password})=>{

    if(!email||!fullName||!password){
        throw new Error('All fields are required')
    }

    const user=await userModel.create({
        email,
        fullName: {  
            firstName: fullName.firstName,
            lastName: fullName.lastName
        },
        password
    })
    return user


}