import mongoose from "mongoose";
const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, required: true }, // 'like', 'comment', 'follow', etc.
  reference: { type: mongoose.Schema.Types.ObjectId, refPath: "onModel" }, // Post or User
  onModel: { type: String, enum: ["Post", "User"] },
  createdAt: { type: Date, default: Date.now },
});

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
