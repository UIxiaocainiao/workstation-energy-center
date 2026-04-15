import { prisma } from "../lib/prisma";

export async function upsertStatusRecord(args: {
  statusKey: string;
  deviceId: string;
  date: string;
}) {
  const status = await prisma.statusOption.findUnique({
    where: { statusKey: args.statusKey }
  });

  if (!status) {
    throw new Error("Invalid status key");
  }

  return prisma.statusRecord.upsert({
    where: {
      deviceId_date: {
        deviceId: args.deviceId,
        date: new Date(args.date)
      }
    },
    update: {
      statusKey: args.statusKey
    },
    create: {
      statusKey: args.statusKey,
      deviceId: args.deviceId,
      date: new Date(args.date)
    }
  });
}

export async function getStatusStats(date: string) {
  const targetDate = new Date(date);
  const items = await prisma.statusOption.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: "asc" }
  });

  const records = await prisma.statusRecord.groupBy({
    by: ["statusKey"],
    where: { date: targetDate },
    _count: { statusKey: true }
  });

  const merged = items.map((item) => ({
    statusKey: item.statusKey,
    statusName: item.statusName,
    count: records.find((r) => r.statusKey === item.statusKey)?._count.statusKey ?? 0
  }));

  return {
    total: merged.reduce((sum, item) => sum + item.count, 0),
    items: merged
  };
}
