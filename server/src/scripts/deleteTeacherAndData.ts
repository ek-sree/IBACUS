import { prisma } from "../config/prisma.js";



const teacherId = "288f0df0-1fdd-4400-ad27-631893583ce5";

(async () => {
  try {
    await prisma.$transaction([
      // Deleting all submissions 
      prisma.taskSubmission.deleteMany({ where: { teacherId } }),

      // Delete all tasks by this teacher
      prisma.task.deleteMany({ where: { teacherId } }),

      // Delete all students assigned to this teacher
      prisma.student.deleteMany({ where: { teacherId } }),

      //  delete the teacher
      prisma.teacher.delete({ where: { id: teacherId } }),
    ]);

    console.log(` Successfully deleted teacher ${teacherId} and all related data`);
  } catch (error) {
    console.error(` Error deleting teacher:`, error);
  } finally {
    await prisma.$disconnect();
  }
})();
