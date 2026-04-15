import { Router } from "express";
import { getStatusStatistics, getTodayStatus, submitStatus } from "../controllers/statusController";

const router = Router();

router.post("/submit", submitStatus);
router.get("/today", getTodayStatus);
router.get("/stats", getStatusStatistics);

export default router;
