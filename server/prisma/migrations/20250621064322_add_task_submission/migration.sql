-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "subject" TEXT NOT NULL,
    "assignedDate" DATETIME NOT NULL,
    "dueDate" DATETIME NOT NULL,
    "text" TEXT,
    "maxMarks" INTEGER NOT NULL,
    "attachments" JSONB,
    "images" JSONB,
    "teacherId" TEXT NOT NULL,
    "classrooms" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Task_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TaskSubmission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "taskId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "text" TEXT,
    "attachments" JSONB,
    "images" JSONB,
    "status" BOOLEAN NOT NULL DEFAULT false,
    "grade" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TaskSubmission_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TaskSubmission_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_TaskStudents" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_TaskStudents_A_fkey" FOREIGN KEY ("A") REFERENCES "Student" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_TaskStudents_B_fkey" FOREIGN KEY ("B") REFERENCES "Task" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_TaskStudents_AB_unique" ON "_TaskStudents"("A", "B");

-- CreateIndex
CREATE INDEX "_TaskStudents_B_index" ON "_TaskStudents"("B");
