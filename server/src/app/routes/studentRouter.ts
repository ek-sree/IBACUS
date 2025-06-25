import { Router } from 'express';
import { StudentController } from '../controller/studentController.js';
import { uploadMiddleware } from '../../middleware/multer.js';

const studentRouter = Router();

const studentController = new StudentController();

studentRouter.get("/get-students-tasks", studentController.getTasksByStudent);
studentRouter.post('/add-task-answers',uploadMiddleware, studentController.addTaskAnswer);
studentRouter.get('/student-dashboard/:id', studentController.fetchDashboardData);

export { studentRouter }