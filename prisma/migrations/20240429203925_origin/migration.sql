-- CreateTable
CREATE TABLE "auth_user" (
    "id" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',
    "email" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "verified_at" TIMESTAMPTZ,
    "verification_requested_at" TIMESTAMPTZ,
    "password_reset_requested_at" TIMESTAMPTZ,
    "password_reset_code" TEXT,
    "password_reset_code_expires_at" TIMESTAMPTZ,
    "plan" TEXT,
    "stripe_customer_id" TEXT,
    "stripe_subscription_id" TEXT,
    "subscription_ends_at" TIMESTAMPTZ,
    "stripe_subscription_status" TEXT,
    "reply_credits" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ,

    CONSTRAINT "auth_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "expires_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bot" (
    "id" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "proxy_host" TEXT,
    "proxy_port" INTEGER,
    "proxy_user" TEXT,
    "proxy_pass" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_used_at" TIMESTAMPTZ,

    CONSTRAINT "bot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bot_error" (
    "id" TEXT NOT NULL,
    "bot_id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "date" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bot_error_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "website_url" TEXT,
    "query" TEXT,
    "reply_mention_mode" TEXT NOT NULL DEFAULT 'name',
    "reply_with_domain" BOOLEAN NOT NULL DEFAULT true,
    "reply_delay" INTEGER NOT NULL DEFAULT 10,
    "reply_daily_limit" INTEGER NOT NULL DEFAULT 25,
    "reply_custom_instructions" TEXT,
    "reddit_monitor_enabled" BOOLEAN NOT NULL DEFAULT true,
    "reddit_allow_nsfw" BOOLEAN NOT NULL DEFAULT false,
    "reddit_replies_enabled" BOOLEAN NOT NULL DEFAULT true,
    "reddit_included_subreddits" TEXT[],
    "reddit_excluded_subreddits" TEXT[],
    "webhook_url" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ,

    CONSTRAINT "project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lead" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'post',
    "project_id" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "name" TEXT,
    "title" TEXT,
    "content" TEXT NOT NULL,
    "remote_url" TEXT,
    "date" TIMESTAMPTZ NOT NULL,
    "remote_id" TEXT NOT NULL,
    "remote_user_id" TEXT NOT NULL,
    "channel" TEXT,
    "remote_channel_id" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reply_status" TEXT,
    "reply_remote_id" TEXT,
    "reply_remote_url" TEXT,
    "reply_text" TEXT,
    "reply_bot_id" TEXT,
    "replied_at" TIMESTAMPTZ,
    "reply_scheduled_at" TIMESTAMPTZ,
    "replies_generated" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "lead_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "auth_user_email_key" ON "auth_user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "auth_user_password_reset_code_key" ON "auth_user"("password_reset_code");

-- CreateIndex
CREATE UNIQUE INDEX "auth_user_stripe_customer_id_key" ON "auth_user"("stripe_customer_id");

-- CreateIndex
CREATE UNIQUE INDEX "auth_user_stripe_subscription_id_key" ON "auth_user"("stripe_subscription_id");

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bot_error" ADD CONSTRAINT "bot_error_bot_id_fkey" FOREIGN KEY ("bot_id") REFERENCES "bot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "project_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead" ADD CONSTRAINT "lead_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead" ADD CONSTRAINT "lead_reply_bot_id_fkey" FOREIGN KEY ("reply_bot_id") REFERENCES "bot"("id") ON DELETE SET NULL ON UPDATE CASCADE;
