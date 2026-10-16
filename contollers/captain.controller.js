import { validationResult } from "express-validator";
import { captainModel } from "../models/captain.model.js";
import { captainService } from "../services/captain.services.js";

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
