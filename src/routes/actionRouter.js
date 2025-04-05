import express from "express";
import { getactions, updateActionStatus, createaction } from "../controllers/actionController.js";
import { actionSchema } from "../validation/actionValidation.js";

const router = express.Router();

router.get("/", getactions);

router.post("/create", (req, res, next) => {
    const { error } = actionSchema.validate(req.body);
    if (error) {
        return res.status(400).json({
            message: error.details[0].message,
            status: 400
        });
    }
    next();
}, createaction);

router.put("/update/:id", updateActionStatus);

export default router;
