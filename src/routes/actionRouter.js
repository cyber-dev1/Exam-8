import express from "express";
import { getactions, createaction, updateActionStatus, deleteAction, getactionByID } from "../controllers/actionController.js";
import { actionSchema } from "../validation/actionValidation.js";

const router = express.Router();

router.get("/", getactions);
router.get("/:id", getactionByID)

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

router.delete("/delete/:id", deleteAction);

export default router;