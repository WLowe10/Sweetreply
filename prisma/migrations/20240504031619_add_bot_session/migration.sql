ALTER TABLE "bot" ADD COLUMN     "session" JSONB;

ALTER TABLE "lead" ADD COLUMN     "remote_parent_id" TEXT;
ALTER TABLE "lead" RENAME COLUMN "channel" TO "group";
ALTER TABLE "lead" RENAME COLUMN "remote_channel_id" TO "remote_group_id";
