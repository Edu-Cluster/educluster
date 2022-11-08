-- CreateTable
CREATE TABLE "person" (
    "id" BIGSERIAL NOT NULL,
    "inserted_at" TIMESTAMPTZ(6) NOT NULL DEFAULT timezone('utc'::text, now()),
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT timezone('utc'::text, now()),
    "untis_username" TEXT NOT NULL,
    "teams_email" TEXT,
    "username" TEXT NOT NULL,

    CONSTRAINT "person_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "person_untis_username_key" ON "person"("untis_username");

-- CreateIndex
CREATE UNIQUE INDEX "person_teams_email_key" ON "person"("teams_email");

-- CreateIndex
CREATE UNIQUE INDEX "person_username_key" ON "person"("username");
