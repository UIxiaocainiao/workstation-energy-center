import { Router } from "express";
import { getSiteConfig, getTopicModules } from "../controllers/configController";

const router = Router();

router.get("/site", getSiteConfig);
router.get("/topic-modules", getTopicModules);

export default router;
