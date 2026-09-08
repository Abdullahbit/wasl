-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "university" TEXT NOT NULL,
    "arrivalStage" TEXT NOT NULL,
    "turkishLevel" TEXT NOT NULL,
    "specialization" TEXT NOT NULL,
    "interests" TEXT[],
    "goals" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Community" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "languages" TEXT[],
    "universities" TEXT[],
    "interests" TEXT[],
    "location" TEXT,
    "targetAudience" TEXT,
    "joinUrl" TEXT,
    "newcomerFriendly" BOOLEAN NOT NULL DEFAULT false,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "lastReviewed" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Community_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Resource" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "lastReviewed" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Resource_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Community_category_idx" ON "Community"("category");

-- CreateIndex
CREATE INDEX "Community_location_idx" ON "Community"("location");

-- CreateIndex
CREATE INDEX "Community_verified_idx" ON "Community"("verified");

-- CreateIndex
CREATE INDEX "Resource_category_idx" ON "Resource"("category");
