-- AlterTable
ALTER TABLE "bot_error" ADD COLUMN     "code" TEXT NOT NULL DEFAULT 'unknown',
ALTER COLUMN "message" DROP NOT NULL;
