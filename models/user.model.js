import mongoose from "mongoose";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
const userSchema=new mongoose.Schema({
    fullName:{
        firstName:{
            type:String,
            required:true,
            minlength:[3,"Atleast 3 character is Required"]
        },
    
        lastName:{
            type:String,
            minlength:[3,"last Name Required Atleast 3 character"]
        }
    },
    email:{
        type: String,
        required: true,
        unique: true,
        minlength: [ 5, 'Email must be at least 5 characters long' ],
    },
    password:{
        type: String,
        required: true,
        select: false,
        
    },
    socketId:{
        type:String,

    }
},{timestamps:true})
userSchema.methods.generateToken=function () {
    const token=jwt.sign({_id:this._id,email:this.email},process.env.JWT_SECRET,{
        expiresIn:'1d'
    })
    return token
}
userSchema.methods.camparePassword=async function(password)
{
    return await bcrypt.compare(password, this.password);
}
userSchema.statics.hashPassword=async function (password){
   return await bcrypt.hash(password,10)
}

export const userModel=mongoose.model('user',userSchema)