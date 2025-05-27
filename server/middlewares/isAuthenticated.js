import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken;
    if(!token) {
      // throw new ApiError(404, "User is not authorized")
      return res
        .status(401)
        .json({ success: false, message: "User is not authorized" });

    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if(!decodedToken) {
      throw new ApiError(401, "Invalid Token");
    }

    const userId = decodedToken?._id;
    
    req.id = userId;
    next();

  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
}
export default isAuthenticated;