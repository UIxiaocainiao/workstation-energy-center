import { Router } from "express";
import {
  forgotPassword,
  getAuthProviders,
  getGoogleAuthUrl,
  getCurrentUser,
  handleGoogleCallback,
  loginWithPassword,
  logout,
  registerWithEmail,
  resetPassword,
} from "../controllers/authController";

const router = Router();

router.get("/providers", getAuthProviders);
router.post("/register", registerWithEmail);
router.post("/login", loginWithPassword);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/me", getCurrentUser);
router.post("/logout", logout);
router.get("/google/url", getGoogleAuthUrl);
router.get("/google/callback", handleGoogleCallback);

export default router;
