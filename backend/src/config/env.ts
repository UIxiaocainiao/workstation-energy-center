import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

export const env = {
  databaseUrl: process.env.DATABASE_URL || "",
  port: Number(process.env.PORT || 3001),
  clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
  adminToken: process.env.ADMIN_TOKEN || "change-me",
  authSecret: process.env.AUTH_SECRET || "change-this-auth-secret",
  googleClientId: process.env.GOOGLE_CLIENT_ID || "",
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
  googleRedirectUri:
    process.env.GOOGLE_REDIRECT_URI || "http://localhost:3001/api/auth/google/callback",
  resendApiKey: process.env.RESEND_API_KEY || "",
  resendFromEmail: process.env.RESEND_FROM_EMAIL || "",
  resetPasswordEmailSubject:
    process.env.RESET_PASSWORD_EMAIL_SUBJECT || "重置你的工位补能站密码",
};
