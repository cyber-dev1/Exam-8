import express from "express";
import {getTechnicById, getTechnics } from "../controllers/technicController.js";

const router = express.Router();

router.get("/", getTechnics);
router.get("/:id", getTechnicById);

export default router;