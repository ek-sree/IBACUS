import express from 'express'
import TeacherController from '../controller/teacherController.js';

const teacherRouter = express.Router();

const teacherController = new TeacherController();
teacherRouter.post("/student-create/:teacherId", teacherController.createStudents);
teacherRouter.get("/get-all-students", teacherController.findAllStudents);
teacherRouter.delete("/delete-student/:id", teacherController.studentDelete);
teacherRouter.put("/edit-student/:id", teacherController.editStudent);
teacherRouter.get("/get-student-class/:teacherId", teacherController.getStudentsAndClasses)
teacherRouter.get("/get-student-by-taskid", teacherController.getStudentByTaskId)
teacherRouter.get("/get-student-answer/:taskId/:studentId", teacherController.getSubmissionAnswers)
teacherRouter.get("/teacher-dashboard/:teacherId", teacherController.getDashboardData)
teacherRouter.post("/add-submission-grade/:id", teacherController.addSubmissionGrade)

export {teacherRouter}