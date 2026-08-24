-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',
    "status" TEXT NOT NULL DEFAULT 'ativo',
    "agePreference" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Game" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "subcategories" TEXT NOT NULL,
    "tags" TEXT NOT NULL,
    "ageRating" TEXT NOT NULL DEFAULT 'Livre',
    "bannerUrl" TEXT NOT NULL,
    "iconUrl" TEXT NOT NULL,
    "prefixUrl" TEXT NOT NULL,
    "version" TEXT NOT NULL DEFAULT '1.0.0',
    "mouse" BOOLEAN NOT NULL DEFAULT true,
    "teclado" BOOLEAN NOT NULL DEFAULT true,
    "toque" BOOLEAN NOT NULL DEFAULT true,
    "gamepad" BOOLEAN NOT NULL DEFAULT false,
    "orientation" TEXT NOT NULL DEFAULT 'both',
    "statusTechnical" TEXT NOT NULL DEFAULT 'pendente_teste',
    "statusEditorial" TEXT NOT NULL DEFAULT 'rascunho',
    "statusDoc" TEXT NOT NULL DEFAULT 'documentacao_pendente',
    "author" TEXT NOT NULL,
    "licenseName" TEXT NOT NULL,
    "publishedAt" DATETIME,
    "revisedAt" DATETIME,
    "accessibilityMetadata" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Contract" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "gameId" TEXT NOT NULL,
    "contractNumber" TEXT NOT NULL,
    "signatoryCreator" TEXT NOT NULL,
    "signatoryRepresentative" TEXT,
    "termsAccepted" BOOLEAN NOT NULL DEFAULT false,
    "licenseType" TEXT NOT NULL,
    "exclusivityScope" TEXT NOT NULL,
    "durationMonths" INTEGER NOT NULL DEFAULT 12,
    "revenueSharePercent" REAL NOT NULL DEFAULT 0.0,
    "fixedPaymentAmount" REAL NOT NULL DEFAULT 0.0,
    "auditLog" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Contract_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Favorite" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Favorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Favorite_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AnalyticsEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "eventType" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "userId" TEXT,
    "deviceType" TEXT NOT NULL,
    "browser" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "consentGiven" BOOLEAN NOT NULL DEFAULT true,
    "gameId" TEXT,
    "gameSlug" TEXT,
    "durationSeconds" INTEGER,
    "placementId" TEXT,
    "adType" TEXT,
    "campaignId" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Game_slug_key" ON "Game"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Contract_gameId_key" ON "Contract"("gameId");

-- CreateIndex
CREATE UNIQUE INDEX "Contract_contractNumber_key" ON "Contract"("contractNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_userId_gameId_key" ON "Favorite"("userId", "gameId");
