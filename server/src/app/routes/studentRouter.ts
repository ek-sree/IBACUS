import { Router } from 'express';
import { StudentController } from '../controller/studentController.js';
import { uploadMiddleware } from '../../middleware/multer.js';
import { authMiddleware } from '../../middleware/authMiddleware.js';

const studentRouter = Router();

const studentController = new StudentController();

studentRouter.get("/get-students-tasks",authMiddleware(["student"]), studentController.getTasksByStudent);
studentRouter.post('/add-task-answers',authMiddleware(['student']), uploadMiddleware, studentController.addTaskAnswer);
studentRouter.get('/student-dashboard/:id',authMiddleware(['student']), studentController.fetchDashboardData);

export { studentRouter }