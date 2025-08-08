import express from "express";
import { createNewUser, loginUser } from "../controllers/userController.js";

const router = express.Router();

// register
router.post("/register", createNewUser);

router.post("/login", loginUser)

export default router; 