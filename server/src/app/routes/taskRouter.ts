import { Router } from "express";
import { TaskController } from "../controller/taskController.js";
import { uploadMiddleware } from "../../middleware/multer.js";

const taskRouter = Router();

const taskController = new TaskController();

taskRouter.post("/add-task/:teacherId",uploadMiddleware, taskController.createTask);
taskRouter.get("/get-tasks", taskController.fetchTasks);
taskRouter.get("/get-students-tasks", taskController.getTasksByClassroomAndStudent);
taskRouter.delete("/delete-task/:id", taskController.deleteTask);

export { taskRouter }