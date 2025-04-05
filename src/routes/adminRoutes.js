import express from "express";
import {editadmin, getadmins} from "../controllers/adminController.js";
import amdinSchema from "../utils/adminValidation.js";

const router = express.Router();

router.get("/", getadmins);

router.put("/edit/:id", (req, res, next) => {
    const { error } = amdinSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message, status: 400 });
    next();
}, editadmin);

export default router;