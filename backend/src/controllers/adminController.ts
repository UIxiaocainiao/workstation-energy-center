import type { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";

const ALLOWED_TOPIC_PATHS = ["/status", "/resonance", "/about", "/contacto"];

export async function listStatusOptions(_req: Request, res: Response) {
  const items = await prisma.statusOption.findMany({ orderBy: { displayOrder: "asc" } });
  res.json({ items });
}

export async function upsertStatusOption(req: Request, res: Response) {
  const body = z.object({
    id: z.string().optional(),
    statusKey: z.string().min(1),
    statusName: z.string().min(1),
    displayOrder: z.number().int().default(0),
    isActive: z.boolean().default(true)
  }).parse(req.body);

  const item = body.id
    ? await prisma.statusOption.update({
        where: { id: body.id },
        data: body
      })
    : await prisma.statusOption.create({ data: body });

  res.json({ item });
}

export async function listCards(_req: Request, res: Response) {
  const items = await prisma.resonanceCard.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] });
  res.json({ items });
}

export async function upsertCard(req: Request, res: Response) {
  const body = z.object({
    id: z.string().optional(),
    type: z.string().min(1),
    title: z.string().min(1),
    content: z.string().min(1),
    tag: z.string().min(1),
    sortOrder: z.number().int().default(0),
    status: z.enum(["draft", "published"]).default("published")
  }).parse(req.body);

  const item = body.id
    ? await prisma.resonanceCard.update({ where: { id: body.id }, data: body })
    : await prisma.resonanceCard.create({ data: body });
  res.json({ item });
}

export async function listTopicModules(_req: Request, res: Response) {
  const items = await prisma.topicModule.findMany({
    where: {
      targetPath: { in: ALLOWED_TOPIC_PATHS }
    },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }]
  });
  res.json({ items });
}

export async function upsertTopicModule(req: Request, res: Response) {
  const body = z.object({
    id: z.string().optional(),
    topicKey: z.string().min(1),
    topicTitle: z.string().min(1),
    targetPath: z.string().min(1),
    copies: z.number().int().min(1).max(12).default(4),
    sortOrder: z.number().int().default(0),
    isActive: z.boolean().default(true)
  }).superRefine((value, ctx) => {
    if (!ALLOWED_TOPIC_PATHS.includes(value.targetPath)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "仅支持 /status、/resonance、/about、/contacto"
      });
    }
  }).parse(req.body);

  const item = body.id
    ? await prisma.topicModule.update({ where: { id: body.id }, data: body })
    : await prisma.topicModule.create({ data: body });
  res.json({ item });
}

export async function getAdminSiteConfig(_req: Request, res: Response) {
  const item = await prisma.siteConfig.findFirst({ orderBy: { createdAt: "desc" } });
  res.json({ item });
}

export async function upsertAdminSiteConfig(req: Request, res: Response) {
  const body = z.object({
    id: z.string().optional(),
    offWorkTime: z.string().min(4),
    payday: z.number().int().min(1).max(31),
    siteName: z.string().min(1),
    slogan: z.string().min(1)
  }).parse(req.body);

  const item = body.id
    ? await prisma.siteConfig.update({ where: { id: body.id }, data: body })
    : await prisma.siteConfig.create({ data: body });
  res.json({ item });
}
