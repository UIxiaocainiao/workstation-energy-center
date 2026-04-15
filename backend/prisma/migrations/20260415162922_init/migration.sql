-- CreateTable
CREATE TABLE "StatusOption" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "statusKey" TEXT NOT NULL,
    "statusName" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "StatusRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "statusKey" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "StatusRecord_statusKey_fkey" FOREIGN KEY ("statusKey") REFERENCES "StatusOption" ("statusKey") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ResonanceCard" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "likeRealCount" INTEGER NOT NULL DEFAULT 0,
    "likeSayCount" INTEGER NOT NULL DEFAULT 0,
    "likeSameCount" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'published',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "CardReaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cardId" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "reactionType" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CardReaction_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "ResonanceCard" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TranslatorTemplate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "mode" TEXT NOT NULL,
    "keyword" TEXT NOT NULL,
    "templateText" TEXT NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "TranslatorExample" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "mode" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "TranslatorLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "mode" TEXT NOT NULL,
    "inputText" TEXT NOT NULL,
    "resultText" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "ComfortText" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "category" TEXT NOT NULL DEFAULT 'general',
    "content" TEXT NOT NULL,
    "isDailyPick" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'active',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "SiteConfig" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "offWorkTime" TEXT NOT NULL DEFAULT '18:00',
    "payday" INTEGER NOT NULL DEFAULT 15,
    "siteName" TEXT NOT NULL DEFAULT '工位补能站',
    "slogan" TEXT NOT NULL DEFAULT '献给每一个表面正常上班、实际全靠硬撑的人',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "StatusOption_statusKey_key" ON "StatusOption"("statusKey");

-- CreateIndex
CREATE INDEX "StatusRecord_statusKey_date_idx" ON "StatusRecord"("statusKey", "date");

-- CreateIndex
CREATE UNIQUE INDEX "StatusRecord_deviceId_date_key" ON "StatusRecord"("deviceId", "date");

-- CreateIndex
CREATE INDEX "CardReaction_cardId_reactionType_idx" ON "CardReaction"("cardId", "reactionType");

-- CreateIndex
CREATE UNIQUE INDEX "CardReaction_cardId_deviceId_reactionType_key" ON "CardReaction"("cardId", "deviceId", "reactionType");
