/*
  Warnings:

  - A unique constraint covering the columns `[taskId,studentId]` on the table `TaskSubmission` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "TaskSubmission_taskId_studentId_key" ON "TaskSubmission"("taskId", "studentId");
