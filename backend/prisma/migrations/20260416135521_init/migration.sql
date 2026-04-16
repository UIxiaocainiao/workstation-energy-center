-- CreateTable
CREATE TABLE "TopicModule" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "topicKey" TEXT NOT NULL,
    "topicTitle" TEXT NOT NULL,
    "targetPath" TEXT NOT NULL,
    "copies" INTEGER NOT NULL DEFAULT 4,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "TopicModule_topicKey_key" ON "TopicModule"("topicKey");
