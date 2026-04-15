import { Router } from "express";
import { generateTranslatorResult, getTranslatorExamples } from "../controllers/translatorController";

const router = Router();

router.get("/examples", getTranslatorExamples);
router.post("/generate", generateTranslatorResult);

export default router;
