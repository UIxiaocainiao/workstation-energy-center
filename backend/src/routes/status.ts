import { Router } from "express";
import { getStatusOptions, getStatusStatistics, getTodayStatus, submitStatus } from "../controllers/statusController";

const router = Router();

router.get("/options", getStatusOptions);
router.post("/submit", submitStatus);
router.get("/today", getTodayStatus);
router.get("/stats", getStatusStatistics);

export default router;
