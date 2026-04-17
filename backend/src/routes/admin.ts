import { Router } from "express";
import { adminAuth } from "../middleware/adminAuth";
import {
  getAdminSiteConfig,
  listCards,
  listStatusOptions,
  listTopicModules,
  upsertAdminSiteConfig,
  upsertCard,
  upsertStatusOption,
  upsertTopicModule
} from "../controllers/adminController";

const router = Router();

router.use(adminAuth);

router.get("/status-options", listStatusOptions);
router.post("/status-options", upsertStatusOption);

router.get("/cards", listCards);
router.post("/cards", upsertCard);

router.get("/topic-modules", listTopicModules);
router.post("/topic-modules", upsertTopicModule);

router.get("/site-config", getAdminSiteConfig);
router.post("/site-config", upsertAdminSiteConfig);

export default router;
