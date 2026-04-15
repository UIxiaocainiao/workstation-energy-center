import type { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { getStatusStats, upsertStatusRecord } from "../services/statusService";

const submitSchema = z.object({
  statusKey: z.string().min(1),
  deviceId: z.string().min(1),
  date: z.string().min(10)
});

const todayQuerySchema = z.object({
  deviceId: z.string().min(1),
  date: z.string().min(10)
});

const statsQuerySchema = z.object({
  date: z.string().min(10)
});

export async function submitStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const body = submitSchema.parse(req.body);
    const record = await upsertStatusRecord(body);
    res.json({ ok: true, record });
  } catch (error) {
    next(error);
  }
}

export async function getTodayStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const query = todayQuerySchema.parse(req.query);

    const record = await prisma.statusRecord.findUnique({
      where: {
        deviceId_date: {
          deviceId: query.deviceId,
          date: new Date(query.date)
        }
      }
    });

    res.json({
      record: record
        ? {
            statusKey: record.statusKey,
            date: record.date.toISOString().slice(0, 10)
          }
        : null
    });
  } catch (error) {
    next(error);
  }
}

export async function getStatusStatistics(req: Request, res: Response, next: NextFunction) {
  try {
    const query = statsQuerySchema.parse(req.query);
    const stats = await getStatusStats(query.date);
    res.json(stats);
  } catch (error) {
    next(error);
  }
}