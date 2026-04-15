import type { NextFunction, Request, Response } from "express";
import { env } from "../config/env";

export function adminAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.headers["x-admin-token"];
  if (token !== env.adminToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  req.adminAuthorized = true;
  next();
}
