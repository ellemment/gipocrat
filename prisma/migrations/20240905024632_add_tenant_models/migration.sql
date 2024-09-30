/*
  Warnings:

  - You are about to drop the column `charSet` on the `Verification` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[providerId]` on the table `Connection` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[providerId,userId]` on the table `Connection` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN "defaultWorkspaceId" TEXT;
ALTER TABLE "User" ADD COLUMN "firstname" TEXT;
ALTER TABLE "User" ADD COLUMN "surname" TEXT;

-- CreateTable
CREATE TABLE "Tenant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "TenantUser" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "joined" INTEGER NOT NULL,
    "status" INTEGER NOT NULL,
    CONSTRAINT "TenantUser_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "TenantUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "TenantUser_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TenantUserInvitation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "pending" BOOLEAN NOT NULL,
    "createdUserId" TEXT,
    CONSTRAINT "TenantUserInvitation_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "TenantUserInvitation_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "TenantUserInvitation_createdUserId_fkey" FOREIGN KEY ("createdUserId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TenantUserInvitationWorkspace" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "invitationId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    CONSTRAINT "TenantUserInvitationWorkspace_invitationId_fkey" FOREIGN KEY ("invitationId") REFERENCES "TenantUserInvitation" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Workspace" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" INTEGER NOT NULL,
    "businessMainActivity" TEXT NOT NULL,
    "registrationNumber" TEXT NOT NULL,
    "registrationDate" DATETIME,
    CONSTRAINT "Workspace_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "WorkspaceUser" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "workspaceId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "WorkspaceUser_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "WorkspaceUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Member" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdByUserId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    CONSTRAINT "Member_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Member_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Member_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Verification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" TEXT NOT NULL,
    "target" TEXT NOT NULL,
    "secret" TEXT NOT NULL,
    "algorithm" TEXT NOT NULL,
    "digits" INTEGER NOT NULL,
    "period" INTEGER NOT NULL,
    "expiresAt" DATETIME
);
INSERT INTO "new_Verification" ("algorithm", "createdAt", "digits", "expiresAt", "id", "period", "secret", "target", "type") SELECT "algorithm", "createdAt", "digits", "expiresAt", "id", "period", "secret", "target", "type" FROM "Verification";
DROP TABLE "Verification";
ALTER TABLE "new_Verification" RENAME TO "Verification";
CREATE UNIQUE INDEX "Verification_target_type_key" ON "Verification"("target", "type");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "TenantUserInvitation_createdUserId_key" ON "TenantUserInvitation"("createdUserId");

-- CreateIndex
CREATE UNIQUE INDEX "Connection_providerId_key" ON "Connection"("providerId");

-- CreateIndex
CREATE UNIQUE INDEX "Connection_providerId_userId_key" ON "Connection"("providerId", "userId");
