import type { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { generateTranslatorText } from "../services/translatorService";

const modeSchema = z.enum(["boss_to_truth", "truth_to_polite"]);

export async function getTranslatorExamples(req: Request, res: Response) {
  const query = z.object({ mode: modeSchema }).parse(req.query);

  const examples = await prisma.translatorExample.findMany({
    where: { mode: query.mode, status: "active" },
    orderBy: { sortOrder: "asc" }
  });

  res.json({
    mode: query.mode,
    examples: examples.map((item) => item.content)
  });
}

export async function generateTranslatorResult(req: Request, res: Response) {
  const body = z.object({
    mode: modeSchema,
    inputText: z.string().min(2).max(100)
  }).parse(req.body);

  const templates = await prisma.translatorTemplate.findMany({
    where: { mode: body.mode, status: "active" },
    orderBy: [{ priority: "desc" }, { createdAt: "desc" }]
  });

  const result = generateTranslatorText(body.mode, body.inputText, templates);

  await prisma.translatorLog.create({
    data: {
      mode: body.mode,
      inputText: body.inputText,
      resultText: result.resultText
    }
  });

  res.json(result);
}
