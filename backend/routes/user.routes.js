import { Router } from "express";
import {
  GetUserDetail,
  GetAllUsers,
  UpdateUser,
  DeleteUser,
  SuggestedUsers,
  FollowOrUnfollow,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { VerifyUser } from "../middlewares/auth.middleware.js";
const router = Router();
router.get("/suggested", VerifyUser, SuggestedUsers);
router.get("/", VerifyUser, GetAllUsers);
router.get("/:id", VerifyUser, GetUserDetail);
router.post("/follow/:id", VerifyUser, FollowOrUnfollow);
router.patch("/:id", VerifyUser, upload.single("profile_image"), UpdateUser);
router.delete("/:id", VerifyUser, DeleteUser);

export default router;
