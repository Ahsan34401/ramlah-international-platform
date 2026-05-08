-- AlterTable
ALTER TABLE "EmployerInquiry" ADD COLUMN "internalNote" TEXT;

-- CreateTable
CREATE TABLE "SiteSetting" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Job" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "summary" TEXT,
    "description" TEXT,
    "country" TEXT,
    "sector" TEXT,
    "salaryHint" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "expiresAt" DATETIME,
    "publishedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Job" ("country", "createdAt", "description", "id", "publishedAt", "salaryHint", "sector", "slug", "status", "summary", "title", "updatedAt") SELECT "country", "createdAt", "description", "id", "publishedAt", "salaryHint", "sector", "slug", "status", "summary", "title", "updatedAt" FROM "Job";
DROP TABLE "Job";
ALTER TABLE "new_Job" RENAME TO "Job";
CREATE UNIQUE INDEX "Job_slug_key" ON "Job"("slug");
CREATE TABLE "new_JobApplication" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "referenceCode" TEXT,
    "jobId" TEXT,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "cnic" TEXT,
    "category" TEXT,
    "message" TEXT,
    "experienceYears" INTEGER,
    "expectedSalary" TEXT,
    "availableFrom" DATETIME,
    "skills" TEXT,
    "coverLetter" TEXT,
    "cvPath" TEXT,
    "photoPath" TEXT,
    "status" TEXT NOT NULL DEFAULT 'RECEIVED',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "JobApplication_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_JobApplication" ("category", "cnic", "createdAt", "email", "fullName", "id", "jobId", "message", "phone", "status", "updatedAt") SELECT "category", "cnic", "createdAt", "email", "fullName", "id", "jobId", "message", "phone", "status", "updatedAt" FROM "JobApplication";
DROP TABLE "JobApplication";
ALTER TABLE "new_JobApplication" RENAME TO "JobApplication";
CREATE UNIQUE INDEX "JobApplication_referenceCode_key" ON "JobApplication"("referenceCode");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "SiteSetting_key_key" ON "SiteSetting"("key");
