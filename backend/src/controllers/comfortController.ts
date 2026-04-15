import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export async function getDailyComfortText(_req: Request, res: Response) {
  const daily = await prisma.comfortText.findFirst({
    where: { status: "active", isDailyPick: true },
    orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }]
  });

  if (!daily) {
    return res.json({ id: "fallback", content: "今天辛苦了，先别急着要求自己立刻振作。" });
  }

  return res.json({ id: daily.id, content: daily.content });
}

export async function getRandomComfortText(_req: Request, res: Response) {
  const items = await prisma.comfortText.findMany({
    where: { status: "active" }
  });

  const selected =
    items[Math.floor(Math.random() * items.length)] ??
    { id: "fallback", content: "你不是效率下降了，你只是已经撑了很久。" };

  res.json({ id: selected.id, content: selected.content });
}
