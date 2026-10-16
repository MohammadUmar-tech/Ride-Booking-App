import jwt from 'jsonwebtoken'
import {userModel} from '../models/user.model.js'
import { blacklistTokenModel } from '../models/blacklist.model.js'
import { captainModel } from '../models/captain.model.js'
export const  authenticationMiddleware=async(req,res,next)=>{
    
    const token=req.cookies?.token||req.header('Authorization').replace('Bearer ',"")
    
    if(!token){
        return res.status(401).json({message:"Unauthorized Access"})
    }
    
    try {
        const findToken=await blacklistTokenModel.findOne({token})
        if(findToken){
        return res.status(401).json({message:'Unathorized Access'})
        }
        const decode=jwt.verify(token,process.env.JWT_SECRET)
        const user=await userModel.findOne({_id:decode._id})
        req.user=user
        return next()

    } catch (error) {
        return res.status(401).json({message:'Unathorized Access',
            error:error
        })
    }

}


export const captainAuthenticationMiddleware=async(req,res,next)=>{


    const token=req.cookies?.token||req.header('Authorization').replace("Bearer ","")

    if(!token){
        return res.status(401).json({message:"Unathorized Captain"})
    }

    try {
        const blacklist=await blacklistTokenModel.findOne({token})
        if(blacklist){
            return res.status(401).json({message:'Unathorized'})
        }
        const decode=jwt.verify(token,process.env.JWT_SECRET)
        const captain=await captainModel.findOne({_id:decode._id})
        req.catain=captain
        return next()
    } catch (error) {
         return res.status(401).json({message:'Unathorized Access',
            error:error
        })
    }
}