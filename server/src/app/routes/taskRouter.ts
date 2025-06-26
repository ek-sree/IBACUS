import { Router } from "express";
import { TaskController } from "../controller/taskController.js";
import { uploadMiddleware } from "../../middleware/multer.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";

const taskRouter = Router();

const taskController = new TaskController();

taskRouter.post("/add-task/:teacherId",authMiddleware(["teacher"]), uploadMiddleware, taskController.createTask);
taskRouter.get("/get-tasks", taskController.fetchTasks);
taskRouter.delete("/delete-task/:id",authMiddleware(["teacher"]), taskController.deleteTask);

export { taskRouter }