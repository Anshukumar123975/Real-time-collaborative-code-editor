import express from "express";
import { roomCreate } from "../controllers/room.controller.js";
const router = express.Router();

// Register route
router.post("/create", roomCreate);

export default router;
