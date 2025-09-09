import express from "express";
import { createLead, getLeads, updateLead, deleteLead, getLeadStats  } from "../controllers/leadController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createLead);
router.get("/", authMiddleware, getLeads);
router.put("/:id", authMiddleware, updateLead);
router.delete("/:id", authMiddleware, deleteLead);
router.get("/stats", authMiddleware, getLeadStats);

export default router;
