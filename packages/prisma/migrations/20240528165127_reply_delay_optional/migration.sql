-- AlterTable
ALTER TABLE "project" ALTER COLUMN "reply_delay" DROP NOT NULL,
ALTER COLUMN "reply_delay" DROP DEFAULT;

-- make everyone's reply delay null (auto)
UPDATE "project" SET "reply_delay" = NULL WHERE "reply_delay" IS NOT NULL