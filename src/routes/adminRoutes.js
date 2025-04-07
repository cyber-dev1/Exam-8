import express from "express";
import { editadmin, getadmins } from "../controllers/adminController.js";
import validateAdmin from "../utils/adminValidation.js";

const router = express.Router();

router.get("/", getadmins);

router.patch("/edit/:id", async (req, res, next) => {
  try {
    await validateAdmin.validateAsync(req.body);
    next();
  } catch (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
}, editadmin);

export default router;
