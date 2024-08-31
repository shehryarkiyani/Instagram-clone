import mongoose, { Schema } from "mongoose";

const PostSchema = new Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  image: { type: String, required: true },
  caption: { type: String },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
});
const Post = mongoose.model("Post", PostSchema);

export default Post;
