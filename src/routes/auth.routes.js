import express from "express";
import { loginController, registerController } from "../controllers/user.contollers.js";

const router = express.Router();

// Register route
router.post("/register", registerController);
router.post("/",loginController);

export default router;
