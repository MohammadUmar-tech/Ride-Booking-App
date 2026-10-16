import { validationResult } from "express-validator";
import { captainModel } from "../models/captain.model.js";
import { captainService } from "../services/captain.services.js";
import { blacklistTokenModel } from "../models/blacklist.model.js";

const option = {
  httpOnly: true,
  secure: false,
  maxAge: 24 * 60 * 60 * 1000,
};
export const createCaptainController = async (req, res) => {
  try {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ errors: error.array() });
    }
    const { email, password, fullName, vehicle } = req.body;
    
    if (!email || !password ||! fullName || !vehicle) {
      throw new Error(" email, password,vehicle are required");
    }

    const isEmailExist = await captainModel.findOne({ email });
    if (isEmailExist) {
      return res
        .status(401)
        .json({ message: "captain Alredy Exist with this email" });
    }

    const hash = await captainModel.hashPassword(password);

    const captain = await captainService({ email, password:hash, fullName, vehicle });

    const token = captain.generateToken();

    res.cookie("token", token, option);

    return res.status(200).json({
      message: "Captain Created Successfully",
      captain: captain,
      token: token,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server Error", Error: `${error}` });
  }
};

export const captainLoginController=async (req,res)=>{

 const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }


      const { email, password } = req.body;


          const captain = await captainModel.findOne({ email }).select('+password');

    if (!captain) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

     const isMatch = await captain.comparePassword(password);

     
    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }
    const token = captain.generateAuthToken();

        res.cookie('token', token);

         return res.status(200).json({ token, captain });
}


export const getCaptainProfile = async (req, res, next) => {
    res.status(200).json({ captain: req.captain });
}

export const logoutCaptainController=async(req,res,next)=>{
    res.clearCookies('token')

    const token=req.cookies.token||req.header('Authorization').replace('Bearer ',"")

    await blacklistTokenModel.create({token})

     res.status(200).json({ message: 'Logout successfully' });

}
