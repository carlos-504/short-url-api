-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "short_urls" (
    "id" SERIAL NOT NULL,
    "original_url" TEXT NOT NULL,
    "short_code" VARCHAR(6) NOT NULL,
    "clicks" BIGINT NOT NULL DEFAULT 0,
    "user_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "short_urls_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "short_urls_short_code_key" ON "short_urls"("short_code");

-- CreateIndex
CREATE INDEX "short_urls_short_code_idx" ON "short_urls"("short_code");

-- CreateIndex
CREATE INDEX "short_urls_user_id_idx" ON "short_urls"("user_id");

-- AddForeignKey
ALTER TABLE "short_urls" ADD CONSTRAINT "short_urls_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
