import express from "express";
import cors from "cors";
import morgan from "morgan";
import { env } from "./config/env";
import statusRoutes from "./routes/status";
import cardsRoutes from "./routes/cards";
import configRoutes from "./routes/config";
import adminRoutes from "./routes/admin";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";

export function createApp() {
  const app = express();

  app.use(cors({ origin: env.clientOrigin }));
  app.use(morgan("dev"));
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({ ok: true });
  });

  app.use("/api/status", statusRoutes);
  app.use("/api/cards", cardsRoutes);
  app.use("/api/config", configRoutes);
  app.use("/api/admin", adminRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
