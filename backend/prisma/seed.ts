import { PrismaClient, TranslatorMode } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.siteConfig.upsert({
    where: { id: "site-config-default" },
    update: {},
    create: {
      id: "site-config-default",
      offWorkTime: "18:00",
      payday: 15,
      siteName: "工位补能站",
      slogan: "献给每一个表面正常上班、实际全靠硬撑的人"
    }
  });

  const statusOptions = [
    { statusKey: "still_holding", statusName: "还能忍", displayOrder: 1 },
    { statusKey: "slightly_crashing", statusName: "轻微崩溃", displayOrder: 2 },
    { statusKey: "soul_out", statusName: "灵魂出窍", displayOrder: 3 },
    { statusKey: "online_but_off", statusName: "表面在线，实际关机", displayOrder: 4 },
    { statusKey: "quit_but_mortgage", statusName: "想辞职但房贷不同意", displayOrder: 5 }
  ];

  for (const item of statusOptions) {
    await prisma.statusOption.upsert({
      where: { statusKey: item.statusKey },
      update: item,
      create: item
    });
  }

  const cardSeed = [
    {
      type: "work_scene",
      title: "今日最扎心一句",
      content: "这个需求不复杂，只是每个细节都要另外讨论一下。",
      tag: "开会废话现场",
      sortOrder: 1,
      status: "published"
    },
    {
      type: "subtext",
      title: "同事潜台词",
      content: "我先看看，通常代表这事先别再提了。",
      tag: "同事潜台词",
      sortOrder: 2,
      status: "published"
    },
    {
      type: "end_of_day",
      title: "下班前五分钟瞬间",
      content: "鼠标移到右上角的时候，消息提醒开始连响三次。",
      tag: "下班前五分钟",
      sortOrder: 3,
      status: "published"
    }
  ];

  for (const item of cardSeed) {
    await prisma.resonanceCard.create({ data: item });
  }

  const templates = [
    {
      mode: TranslatorMode.boss_to_truth,
      keyword: "不复杂",
      templateText: "真实含义：这事不叫简单，只是默认由你承受复杂度。",
      priority: 100
    },
    {
      mode: TranslatorMode.boss_to_truth,
      keyword: "跟进",
      templateText: "真实含义：先由你把这件事接住，后面进度也主要由你兜。",
      priority: 90
    },
    {
      mode: TranslatorMode.truth_to_polite,
      keyword: "不是我的",
      templateText: "更体面的表达：当前任务与我的职责边界暂不完全匹配，建议先确认归属。",
      priority: 100
    },
    {
      mode: TranslatorMode.truth_to_polite,
      keyword: "时间不够",
      templateText: "更体面的表达：按照当前排期评估，交付时间存在明显风险，建议协调资源或调整节点。",
      priority: 90
    }
  ];

  for (const item of templates) {
    await prisma.translatorTemplate.create({ data: item });
  }

  const examples = [
    { mode: TranslatorMode.boss_to_truth, content: "这个需求不复杂", sortOrder: 1 },
    { mode: TranslatorMode.boss_to_truth, content: "你先跟进一下", sortOrder: 2 },
    { mode: TranslatorMode.boss_to_truth, content: "我们再优化一下细节", sortOrder: 3 },
    { mode: TranslatorMode.truth_to_polite, content: "这活不是我的", sortOrder: 1 },
    { mode: TranslatorMode.truth_to_polite, content: "这个需求改太多次了", sortOrder: 2 },
    { mode: TranslatorMode.truth_to_polite, content: "这时间根本不够", sortOrder: 3 }
  ];

  for (const item of examples) {
    await prisma.translatorExample.create({ data: item });
  }

  const comfortTexts = [
    { category: "daily", content: "今天辛苦了，不是你不够强，是你已经扛了很久。", isDailyPick: true, sortOrder: 1 },
    { category: "general", content: "先别急着振作，允许自己先喘一口气。", sortOrder: 2 },
    { category: "general", content: "你不是效率下降了，你只是需要补能。", sortOrder: 3 },
    { category: "general", content: "能撑到现在，已经说明你很努力了。", sortOrder: 4 }
  ];

  for (const item of comfortTexts) {
    await prisma.comfortText.create({ data: item });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
