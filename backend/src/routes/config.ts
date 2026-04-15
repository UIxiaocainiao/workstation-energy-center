import { Router } from "express";
import { getSiteConfig } from "../controllers/configController";

const router = Router();

router.get("/site", getSiteConfig);

export default router;
