import mongoose, { Schema } from "mongoose";

const PostSchema = new Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    image: { type: String, required: true },
    image_public_id: { type: String, default: "" },
    caption: { type: String, default: "" },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] }],
    comments: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Comment", default: [] },
    ],
  },
  { timestamps: true }
);
PostSchema.pre("deleteOne", async function (next) {});
const Post = mongoose.model("Post", PostSchema);

export default Post;
