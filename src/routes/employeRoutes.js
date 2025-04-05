import express from "express";
import {createemploye, deleteemploye, editemploye, getemployes } from "../controllers/employeController.js";

const router = express.Router();

router.get("/", getemployes);
router.post("/create", createemploye);
router.put("/edit/:id", editemploye);
router.delete("/delete/:id", deleteemploye);

export default router;