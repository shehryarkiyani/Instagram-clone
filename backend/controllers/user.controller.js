import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { UploadCloudinary } from "../utils/cloudinary.js";
import { v2 as cloudinary } from "cloudinary";
export const GetAllUsers = async (req, res, next) => {
  try {
    const query = { role: "User" };
    let users = await User.find(query).select("-password -image_public_id");
    const response = new ApiResponse(200, users, "Users Fetch Successfully");
    return res.json(response);
  } catch (err) {
    next(err);
  }
};
export const GetUserDetail = async (req, res, next) => {
  try {
    const { id } = req.params;
    let user = await User.findOne({ _id: id }).select("-password");
    const response = new ApiResponse(200, user, "User Fetch Successfully");
    return res.json(response);
  } catch (err) {
    next(err);
  }
};
export const UpdateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const ImageLocalPath = req.file?.path;
    let user = await User.findOne({ _id: id }).select("-password");
    if (!user) throw new ApiError(400, "User not exist");
    if (ImageLocalPath) {
      if (user?.image_public_id) {
        await cloudinary.uploader.destroy(user?.image_public_id);
      }
      const profileImage = await UploadCloudinary(ImageLocalPath);
      user.profilePicture = profileImage?.url;
      user.image_public_id = profileImage?.public_id || "";
    } else {
      user.bio = req?.body?.bio || user?.bio;
      user.username = req?.body?.username || user?.username;
    }
    await user.save();

    const response = new ApiResponse(200, user, "User Updated Successfully");
    return res.json(response);
  } catch (err) {
    next(err);
  }
};
export const DeleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user?.image_public_id) {
      await cloundinary.uploader.destroy(user.image_public_id);
    }
    await User.findByIdAndDelete(req.params.id);

    return res.status(200).json({ message: "User Deleted Successfully" });
  } catch (err) {
    next(err);
  }
};
export const SuggestedUsers = async (req, res, next) => {
  try {
    const users = await User.findOne({ _id: { $ne: req.user._id } }).select(
      "-password"
    );
    const response = new ApiResponse(200, users, "Users Fetch Successfully");
    return res.json(response);
  } catch (err) {
    next(err);
  }
};
export const FollowOrUnfollow = async (req, res, next) => {
  try {
    let loginUser = req.user._id;
    if (loginUser === req.params.id) {
      throw new ApiError(400, "You cannot follow/Unfollow yourself");
    }
    let user = await User.findOne({ _id: req.user._id });
    let targetuser = await User.findOne({ _id: req.params.id });
    if (!targetuser || !user) throw new ApiError(400, "User not found");
    let isFollowing = user.following.includes(req.params.id);
    if (isFollowing) {
      await Promise.all([
        User.updateOne(
          { _id: req.user._id },
          { $pull: { following: req.params.id } }
        ),
        User.updateOne(
          { _id: req.params.id },
          { $pull: { followers: req.user._id } }
        ),
      ]);
      return res.json(new ApiResponse(200, "Unfollow Successfully"));
    } else {
      await Promise.all([
        User.updateOne(
          { _id: req.user._id },
          { $push: { following: req.params.id } }
        ),
        User.updateOne(
          { _id: req.params.id },
          { $push: { followers: req.user._id } }
        ),
      ]);
      return res.json(new ApiResponse(200, "Follow Successfully"));
    }
  } catch (err) {
    next(err);
  }
};
