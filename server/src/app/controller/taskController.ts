import { Request, Response } from "express";
import TaskUseCase from "../use-case/taskUseCase.js";
import { StatusCode } from "../../interface/statusCode.js";

export class TaskController{
    private taskUseCase: TaskUseCase;

    constructor(){
        this.taskUseCase = new TaskUseCase();
    }

   createTask = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const files = req.files as Record<string, Express.Multer.File[]>;

    const pdfs = files?.attachments;
    const images = files?.images;
    const teacherId = req.params.teacherId;

const result = await this.taskUseCase.addTask(data,teacherId,pdfs,images );
    res.status(StatusCode.Created).json({ message: "Task created successfully",data:result.data })
  } catch (error) {
    console.error("Error occurred while creating task in controller:", error);
    res.status(StatusCode.InternalServerError).json({ message: "Internal server error" });
  }
};

 fetchTasks = async(req:Request,res:Response)=>{
try {
	const data=req.query
   const page = data.page ? Number(data.page) : 1;
    const limit = data.limit ? Number(data.limit) : 5;
    const search = String(data.search) || undefined;
    const sort = String(data.sort) || undefined;

    const payload = {
      page,
      limit,
      search,
      sort,
      teacherId: data.teacherId && data.teacherId !== "undefined" ? String(data.teacherId) : undefined,
      studentId: data.studentId && data.studentId !== "undefined" ? String(data.studentId) : undefined,
      classroom: data.classroom && data.classroom !== "undefined" ? String(data.classroom) : undefined,
      taskId: data.taskId && data.taskId !== "undefined" ? String(data.taskId) : undefined,
    };
  
	const result=await this.taskUseCase.getTasks(payload)
  
	res.status(result.status).json({message:result.message,data:result.data,totalCount:result.totalCount})
}catch(error){
	console.log("Error occurred while fetching tasks in controller:", error);
	res.status(StatusCode.InternalServerError).json({ message: "Internal server error" });
}
  }

 

 

  deleteTask= async(req:Request,res:Response)=>{
    try {
      const taskId=req.params.id
      const result=await this.taskUseCase.deleteTask(taskId)
      res.status(result.status).json({message:result.message})
    } catch (error) {
      console.log("Error occured while deleting task in controller",error)
      res.status(StatusCode.InternalServerError).json({message:"Internal Server Error"})
    }
  }

}