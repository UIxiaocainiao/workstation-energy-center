import { Router } from "express";
import { getDailyComfortText, getRandomComfortText } from "../controllers/comfortController";

const router = Router();

router.get("/daily", getDailyComfortText);
router.get("/random", getRandomComfortText);

export default router;
