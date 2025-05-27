import { ApiError } from "../utils/ApiError.js";

export const generateAccessToken = async (user) => {
  try {
    const accessToken = user.generateAccessToken();

    return accessToken;

  } catch (error) {
    throw new ApiError(500, "Error while generating access and refresh token");
  }
}