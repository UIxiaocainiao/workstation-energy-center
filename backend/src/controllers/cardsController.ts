import type { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function getFeaturedCards(req: Request, res: Response) {
  const query = z.object({
    page: z.coerce.number().default(1),
    pageSize: z.coerce.number().default(6),
    type: z.string().optional()
  }).parse(req.query);

  const items = await prisma.resonanceCard.findMany({
    where: {
      status: "published",
      ...(query.type ? { type: query.type } : {})
    },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    skip: (query.page - 1) * query.pageSize,
    take: query.pageSize
  });

  res.json({ items });
}

export async function submitCardReaction(req: Request, res: Response) {
  const body = z.object({
    cardId: z.string().min(1),
    reactionType: z.enum(["real", "say", "same"]),
    deviceId: z.string().min(1)
  }).parse(req.body);

  const record = await prisma.cardReaction.findFirst({
    where: {
      cardId: body.cardId,
      deviceId: body.deviceId,
      reactionType: body.reactionType
    }
  });

  if (!record) {
    await prisma.cardReaction.create({ data: body });
    await prisma.resonanceCard.update({
      where: { id: body.cardId },
      data:
        body.reactionType === "real"
          ? { likeRealCount: { increment: 1 } }
          : body.reactionType === "say"
            ? { likeSayCount: { increment: 1 } }
            : { likeSameCount: { increment: 1 } }
    });
  }

  res.json({ ok: true });
}
