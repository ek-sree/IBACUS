import { Router } from "express";
import { TaskController } from "../controller/taskController.js";
import { uploadMiddleware } from "../../middleware/multer.js";

const taskRouter = Router();

const taskController = new TaskController();

taskRouter.post("/add-task/:teacherId",uploadMiddleware, taskController.createTask);
taskRouter.get("/get-tasks", taskController.fetchTasks);
taskRouter.get("/get-class-tasks", taskController.getTasksByClass);
taskRouter.get("/get-student-tasks", taskController.getTasksByStudent);
taskRouter.delete("/delete-task/:id", taskController.deleteTask);

export { taskRouter }