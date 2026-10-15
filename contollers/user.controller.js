import { userModel } from "../models/user.model.js";
import {validationResult} from "express-validator"
import { userCreate } from "../services/user.services.js";
export const userRegistreController=async(req,res,next)=>{

   try {

    const error=validationResult(req);
    if(!error.isEmpty()){
         return res.status(400).json({ errors: error.array() });
    }
     const {email,fullName,password}=req.body
     const isUserAlready = await userModel.findOne({ email });

    if (isUserAlready) {
        return res.status(400).json({ message: 'User already exist' });
    }

 
     const hash=await userModel.hashPassword(password)
 
     const user=await userCreate({
         email,
         fullName,
         password:hash
     })
     
     const token=user.generateToken()
 
     const option={
         httpOnly:true,
         secure:false,
         maxAge:24* 60* 60 * 1000 
     }
 
     res.cookie('token',token,option).status(201).json({message:`User created Successfully`,
         user:user,
         Token:token
     })
   } catch (error) {
    return res.status(404).json({message:'Bad Request Error Occur while Regiteration of user',
        Error:`${error}`
    })
   }
}