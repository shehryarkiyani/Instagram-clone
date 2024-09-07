import Post from "../models/post.model.js";
import Comment from "../models/comment.model.js";
import { Types } from "mongoose";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { v2 as cloudinary } from "cloudinary";
import { UploadCloudinary } from "../utils/cloudinary.js";
export const AddPost = async (req, res, next) => {
  try {
    const { caption } = req.body;

    let userid = req.user._id;
    let image = req.file?.path;
    if (!image) throw new ApiError(400, "Image is required");
    let ImageFile = await UploadCloudinary(image);
    let newPost = new Post({
      image: ImageFile?.url,
      image_public_id: ImageFile?.public_id,
      author: new Types.ObjectId(userid),
      caption,
    });
    await newPost.save();
    return res.json(new ApiResponse(200, newPost, "Post created Successfully"));
  } catch (err) {
    next(err);
  }
};
export const UpdatePost = async (req, res, next) => {
  try {
  } catch (err) {
    next(err);
  }
};
export const GetAllPost = async (req, res, next) => {
  try {
    let posts = await Post.find({})
      .populate("author", "username email profilePicture")
      .populate("likes", "username email profilePicture")
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: {
          path: "author",
          select: "username email profilePicture",
        },
      })
      .sort({ createdAt: -1 });
    return res.json(new ApiResponse(200, posts, "Post fetch successfully"));
  } catch (err) {
    next(err);
  }
};
export const GetUserPost = async (req, res, next) => {
  try {
    let posts = await Post.findOne({ author: req.user._id }).populate(
      "author",
      "username email profilePicture"
    );
    return res.json(new ApiResponse(200, posts, "Post fetch Successfully"));
  } catch (err) {
    next(err);
  }
};
export const GetPostDetails = async (req, res, next) => {
  try {
    let post = await Post.findOne({ _id: req.params.id });
    if (!post) throw new ApiError(400, "Post not found");
    return res.json(new ApiResponse(200, post, "Post fetch successfully"));
  } catch (err) {
    next(err);
  }
};
export const DeletePost = async (req, res, next) => {
  try {
    let post = await Post.findOne({ _id: req.params.id });
    if (!post) throw new ApiError(400, "Post not found");

    if (post.image_public_id) {
      await cloudinary.uploader.destroy(post.image_public_id);
    }
    await Post.deleteOne({ _id: req.params.id });
    return res.json(new ApiResponse(200, "Post Deleted"));
  } catch (err) {
    next(err);
  }
};
export const LikeDislikePost = async (req, res, next) => {
  try {
    let user = req.user._id;
    let post = await Post.findOne({ _id: req.params.id });
    if (!post) throw new ApiError(400, "Post not found");
    if (post.likes.includes(user)) {
      await Post.updateOne({ _id: req.params.id }, { $pull: { likes: user } });
      return res.json(new ApiResponse(200, [], "Post Disklike"));
    } else {
      await Post.updateOne({ _id: req.params.id }, { $push: { likes: user } });
      return res.json(new ApiResponse(200, [], "Post like"));
    }
  } catch (err) {
    next(err);
  }
};
