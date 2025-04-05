import express from "express";
import { getClients, createClient, editClient, deleteClient } from "../controllers/clientController.js";

const router = express.Router();

router.get("/", getClients);
router.post("/create", createClient);
router.put("/edit/:id", editClient);
router.delete("/delete/:id", deleteClient);

export default router;
