import { getAddressCoordinate } from "../services/map.services.js";
import { validationResult } from "express-validator";
import { getDistanceTime ,getAutoCompleteSuggestions} from "../services/map.services.js";
export const getCoordinateController = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { address } = req.query;

    const coordinates = await getAddressCoordinate(address);
    return res.status(200).json(coordinates);
  } catch (error) {
    res.status(404).json({ message: "Coordinates not found" });
  }
};

export const distanceTimeContoller = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { origin, destination } = req.query;

    const response = await getDistanceTime(origin, destination);

    return res.status(200).json(response);
  } catch (error) {
    res.status(404).json({ message: "Coordinates not found" });
  }
};


export const getSuggestionController=async(req,res,next)=>{
      const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const {input}=req.query
    const suggestions=await getAutoCompleteSuggestions(input)
  
    return res.status(200).json(suggestions)
  } catch (error) {
     res.status(404).json({ message: "Coordinates not found" });
  }
}