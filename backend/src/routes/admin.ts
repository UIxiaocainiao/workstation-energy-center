import { Router } from "express";
import { adminAuth } from "../middleware/adminAuth";
import {
  getAdminSiteConfig,
  listCards,
  listComfortTexts,
  listStatusOptions,
  listTranslatorTemplates,
  upsertAdminSiteConfig,
  upsertCard,
  upsertComfortText,
  upsertStatusOption,
  upsertTranslatorTemplate
} from "../controllers/adminController";

const router = Router();

router.use(adminAuth);

router.get("/status-options", listStatusOptions);
router.post("/status-options", upsertStatusOption);

router.get("/cards", listCards);
router.post("/cards", upsertCard);

router.get("/translator-templates", listTranslatorTemplates);
router.post("/translator-templates", upsertTranslatorTemplate);

router.get("/comfort-texts", listComfortTexts);
router.post("/comfort-texts", upsertComfortText);

router.get("/site-config", getAdminSiteConfig);
router.post("/site-config", upsertAdminSiteConfig);

export default router;
