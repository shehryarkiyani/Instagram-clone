import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
export const RegisterUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    if (
      [username, email, password].some(
        (field) => field?.trim() === "" || field === undefined
      )
    ) {
      throw new ApiError(400, "Username,email and password is required");
    }
    let user = await User.findOne({ email });
    if (user) throw new ApiError(400, "user already exist");
    let newuser = new User({
      username,
      email,
      password,
    });
    await newuser.save();
    return res.json(new ApiResponse(200, [], "User Register Successfully"));
  } catch (err) {
    next(err);
  }
};
export const Login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (
      [email, password].some(
        (fields) => fields?.trim() === "" || fields === undefined
      )
    ) {
      throw new ApiError(400, "Email and password is required");
    }
    let user = await User.findOne({ email });
    if (!user) throw new ApiError(400, "User not found");
    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) throw new ApiError(400, "Password not match");
    const options = {
      httpOnly: true,
      secure: true,
      maxAge: 6 * 60 * 60 * 1000, // 1 hour (in milliseconds)
    };
    const accessToken = await user.generateAccessToken();
    const { password: userPassword, ...userdata } = user._doc;
    const response = new ApiResponse(
      200,
      { ...userdata, accessToken: accessToken },
      "User Login Successfully"
    );
    return res.cookie("accessToken", accessToken, options).json(response);
  } catch (err) {
    next(err);
  }
};
