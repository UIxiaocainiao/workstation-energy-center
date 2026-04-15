import { Router } from "express";
import { getFeaturedCards, submitCardReaction } from "../controllers/cardsController";

const router = Router();

router.get("/featured", getFeaturedCards);
router.post("/reaction", submitCardReaction);

export default router;
