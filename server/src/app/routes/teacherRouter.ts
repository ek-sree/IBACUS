import express from 'express'
import TeacherController from '../controller/teacherController.js';
import { authMiddleware } from '../../middleware/authMiddleware.js';

const teacherRouter = express.Router();

const teacherController = new TeacherController();
teacherRouter.post("/student-create/:teacherId",authMiddleware(["teacher"]), teacherController.createStudents);
teacherRouter.get("/get-all-students",authMiddleware(["teacher"]), teacherController.findAllStudents);
teacherRouter.delete("/delete-student/:id", authMiddleware(["teacher"]), teacherController.studentDelete);
teacherRouter.put("/edit-student/:id",authMiddleware(["teacher"]), teacherController.editStudent);
teacherRouter.get("/get-student-class/:teacherId",authMiddleware(["teacher"]), teacherController.getStudentsAndClasses)
teacherRouter.get("/get-student-by-taskid",authMiddleware(["teacher"]), teacherController.getStudentByTaskId)
teacherRouter.get("/get-student-answer/:taskId/:studentId",authMiddleware(["teacher"]), teacherController.getSubmissionAnswers)
teacherRouter.post("/add-submission-grade/:id",authMiddleware(["teacher"]), teacherController.addSubmissionGrade)
teacherRouter.get("/teacher-dashboard/:teacherId",authMiddleware(["teacher"]), teacherController.getDashboardData)

export {teacherRouter}