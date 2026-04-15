import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

export const env = {
  databaseUrl: process.env.DATABASE_URL || "",
  port: Number(process.env.PORT || 3001),
  clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
  adminToken: process.env.ADMIN_TOKEN || "change-me"
};
