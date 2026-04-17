import { PrismaClient } from "@prisma/client";

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

  const topicModules = [
    { topicKey: "topic_01", topicTitle: "今天靠哪口仙气撑着？", targetPath: "/status", copies: 2, sortOrder: 1, isActive: true },
    { topicKey: "topic_02", topicTitle: "今天先给自己打几分状态？", targetPath: "/status", copies: 2, sortOrder: 2, isActive: true },
    { topicKey: "topic_03", topicTitle: "下班前又是谁在加戏？", targetPath: "/resonance", copies: 2, sortOrder: 3, isActive: true },
    { topicKey: "topic_04", topicTitle: "这周最想吐槽的瞬间是？", targetPath: "/resonance", copies: 2, sortOrder: 4, isActive: true },
    { topicKey: "topic_05", topicTitle: "最近耗你电的是活还是人？", targetPath: "/status", copies: 2, sortOrder: 5, isActive: true },
    { topicKey: "topic_06", topicTitle: "最近一次真放松是什么时候？", targetPath: "/about", copies: 2, sortOrder: 6, isActive: true },
    { topicKey: "topic_07", topicTitle: "哪种会议最适合灵魂出走？", targetPath: "/resonance", copies: 2, sortOrder: 7, isActive: true },
    { topicKey: "topic_08", topicTitle: "这个项目最离谱的一幕是？", targetPath: "/resonance", copies: 2, sortOrder: 8, isActive: true },
    { topicKey: "topic_09", topicTitle: "上班是讨生活还是渡劫？", targetPath: "/status", copies: 2, sortOrder: 9, isActive: true },
    { topicKey: "topic_10", topicTitle: "你最近最真实的状态是？", targetPath: "/status", copies: 2, sortOrder: 10, isActive: true },
    { topicKey: "topic_11", topicTitle: "你最想拉黑哪类消息？", targetPath: "/resonance", copies: 2, sortOrder: 11, isActive: true },
    { topicKey: "topic_12", topicTitle: "想提需求或反馈？", targetPath: "/contacto", copies: 2, sortOrder: 12, isActive: true }
  ];

  for (const item of topicModules) {
    await prisma.topicModule.upsert({
      where: { topicKey: item.topicKey },
      update: item,
      create: item
    });
  }

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
