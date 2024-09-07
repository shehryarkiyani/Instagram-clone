import { Router } from "express";
import {
  GetAllPost,
  GetPostDetails,
  AddPost,
  UpdatePost,
  DeletePost,
  GetUserPost,
  LikeDislikePost,
} from "../controllers/post.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { VerifyUser } from "../middlewares/auth.middleware.js";
const router = Router();
router.get("/", VerifyUser, GetAllPost);
router.get("/user", VerifyUser, GetUserPost);
router.get("/:id", VerifyUser, GetPostDetails);
router.post("/", VerifyUser, upload.single("image"), AddPost);
router.post("/likes/:id", VerifyUser, LikeDislikePost);
router.patch("/:id", VerifyUser, UpdatePost);
router.delete("/:id", VerifyUser, DeletePost);
export default router;
