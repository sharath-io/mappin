import express from "express";
import { createPin, getAllPins } from "../controllers/pinController.js";

const router = express.Router();

router.get("/", getAllPins)

router.post("/", createPin);

export default router;