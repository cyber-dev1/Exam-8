import express from "express";
import { getpriceById, getprices } from "../controllers/priceController.js";

const router = express.Router();

router.get("/", getprices);
router.get("/:id", getpriceById);

export default router;