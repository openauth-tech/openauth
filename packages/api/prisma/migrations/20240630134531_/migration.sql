-- CreateTable
CREATE TABLE "oa_admins" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "oa_admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "oa_apps" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "logoUrl" TEXT,
    "secret" TEXT,
    "emailEnabled" BOOLEAN NOT NULL DEFAULT false,
    "googleEnabled" BOOLEAN NOT NULL DEFAULT false,
    "twitterEnabled" BOOLEAN NOT NULL DEFAULT false,
    "appleEnabled" BOOLEAN NOT NULL DEFAULT false,
    "ethEnabled" BOOLEAN NOT NULL DEFAULT false,
    "solEnabled" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "oa_apps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "oa_users" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastLoginTime" TIMESTAMP(3),
    "email" TEXT,
    "google" TEXT,
    "twitter" TEXT,
    "apple" TEXT,
    "ethAddress" TEXT,
    "solAddress" TEXT,
    "appId" TEXT NOT NULL,

    CONSTRAINT "oa_users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "oa_admins_username_key" ON "oa_admins"("username");

-- CreateIndex
CREATE UNIQUE INDEX "oa_apps_name_key" ON "oa_apps"("name");

-- CreateIndex
CREATE UNIQUE INDEX "oa_users_appId_email_key" ON "oa_users"("appId", "email");

-- CreateIndex
CREATE UNIQUE INDEX "oa_users_appId_google_key" ON "oa_users"("appId", "google");

-- CreateIndex
CREATE UNIQUE INDEX "oa_users_appId_twitter_key" ON "oa_users"("appId", "twitter");

-- CreateIndex
CREATE UNIQUE INDEX "oa_users_appId_apple_key" ON "oa_users"("appId", "apple");

-- CreateIndex
CREATE UNIQUE INDEX "oa_users_appId_ethAddress_key" ON "oa_users"("appId", "ethAddress");

-- CreateIndex
CREATE UNIQUE INDEX "oa_users_appId_solAddress_key" ON "oa_users"("appId", "solAddress");

-- AddForeignKey
ALTER TABLE "oa_users" ADD CONSTRAINT "oa_users_appId_fkey" FOREIGN KEY ("appId") REFERENCES "oa_apps"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
