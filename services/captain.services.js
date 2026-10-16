
import { captainModel } from "../models/captain.model.js";



export const captainService=async({email,password,vehicle,fullName})=>{
    if(!email||!password||!fullName||!vehicle){
        throw new Error(" email, password,vehicle are required");
    }
    if(!vehicle.color||!vehicle.plate||!vehicle.capacity||!vehicle.vehicleType){
        throw new Error("All vehicle are Required")
    }
    const captain=await captainModel.create({
        email,
        password,
        fullName:{
            firstName:fullName.firstName,
            lastName:fullName.lastName
        },
        vehicle:{
            color:vehicle.color,
            plate:vehicle.plate,
            capacity:vehicle.capacity,
            vehicleType:vehicle.vehicleType
        }
    })
    return captain
}