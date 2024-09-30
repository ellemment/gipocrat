/*
  Warnings:

  - You are about to drop the `Member` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tenant` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TenantUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TenantUserInvitation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TenantUserInvitationWorkspace` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Workspace` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WorkspaceUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `defaultWorkspaceId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `firstname` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `surname` on the `User` table. All the data in the column will be lost.
  - Added the required column `charSet` to the `Verification` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Connection_providerId_userId_key";

-- DropIndex
DROP INDEX "Connection_providerId_key";

-- DropIndex
DROP INDEX "TenantUserInvitation_createdUserId_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Member";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Tenant";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "TenantUser";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "TenantUserInvitation";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "TenantUserInvitationWorkspace";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Workspace";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "WorkspaceUser";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("createdAt", "email", "id", "name", "updatedAt", "username") SELECT "createdAt", "email", "id", "name", "updatedAt", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
CREATE TABLE "new_Verification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" TEXT NOT NULL,
    "target" TEXT NOT NULL,
    "secret" TEXT NOT NULL,
    "algorithm" TEXT NOT NULL,
    "digits" INTEGER NOT NULL,
    "period" INTEGER NOT NULL,
    "charSet" TEXT NOT NULL,
    "expiresAt" DATETIME
);
INSERT INTO "new_Verification" ("algorithm", "createdAt", "digits", "expiresAt", "id", "period", "secret", "target", "type") SELECT "algorithm", "createdAt", "digits", "expiresAt", "id", "period", "secret", "target", "type" FROM "Verification";
DROP TABLE "Verification";
ALTER TABLE "new_Verification" RENAME TO "Verification";
CREATE UNIQUE INDEX "Verification_target_type_key" ON "Verification"("target", "type");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
