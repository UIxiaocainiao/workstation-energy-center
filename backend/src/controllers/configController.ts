import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";

const ALLOWED_TOPIC_PATHS = ["/status", "/resonance", "/about", "/contacto"];

export async function getSiteConfig(_req: Request, res: Response) {
  const config = await prisma.siteConfig.findFirst({
    orderBy: { createdAt: "desc" }
  });

  res.json(
    config ?? {
      offWorkTime: "18:00",
      payday: 15,
      siteName: "工位补能站",
      slogan: "献给每一个表面正常上班、实际全靠硬撑的人"
    }
  );
}

export async function getTopicModules(_req: Request, res: Response) {
  const items = await prisma.topicModule.findMany({
    where: {
      isActive: true,
      targetPath: { in: ALLOWED_TOPIC_PATHS }
    },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }]
  });

  res.json({
    items: items.map((item) => ({
      id: item.id,
      topicKey: item.topicKey,
      topicTitle: item.topicTitle,
      targetPath: item.targetPath,
      copies: item.copies,
      sortOrder: item.sortOrder
    }))
  });
}
