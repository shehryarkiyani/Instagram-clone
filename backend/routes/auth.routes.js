import { Router } from "express";
import { RegisterUser, Login } from "../controllers/auth.controller.js";
const router = Router();
router.post("/register", RegisterUser);
router.post("/login", Login);
export default router;
