import express from "express";
import {createemploye, deleteemploye, editemploye, getemployes, getemployeById } from "../controllers/employeController.js";

const router = express.Router();

router.get("/", getemployes);
router.get("/:id", getemployeById);

router.post("/create", createemploye);
router.patch("/edit/:id", editemploye);
router.delete("/delete/:id", deleteemploye);

export default router;