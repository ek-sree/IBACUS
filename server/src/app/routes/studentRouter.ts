import { Router } from 'express';
import { StudentController } from '../controller/studentController.js';
import { uploadMiddleware } from '../../middleware/multer.js';

const studentRouter = Router();

const studentController = new StudentController();

studentRouter.post('/add-task-answers',uploadMiddleware, studentController.addTaskAnswer);

export { studentRouter }