/*
  Warnings:

  - Added the required column `marks` to the `TaskSubmission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teacherId` to the `TaskSubmission` table without a default value. This is not possible if the table is not empty.
  - Made the column `text` on table `TaskSubmission` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TaskSubmission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "taskId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "marks" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "attachments" JSONB,
    "images" JSONB,
    "status" BOOLEAN NOT NULL DEFAULT false,
    "grade" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TaskSubmission_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TaskSubmission_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_TaskSubmission" ("attachments", "createdAt", "grade", "id", "images", "status", "studentId", "taskId", "text") SELECT "attachments", "createdAt", "grade", "id", "images", "status", "studentId", "taskId", "text" FROM "TaskSubmission";
DROP TABLE "TaskSubmission";
ALTER TABLE "new_TaskSubmission" RENAME TO "TaskSubmission";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
