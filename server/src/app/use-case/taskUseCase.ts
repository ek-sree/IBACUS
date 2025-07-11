import { IGetTasks, ITask } from "../../interface/ITask.js";
import { StatusCode } from "../../interface/statusCode.js";
import { uploadImageToCloudinary } from "../../service/cloudinary.js";
import { TaskRepository } from "../repository/taskRepository.js";



export default class TaskUseCase{
    private taskRepo: TaskRepository;

    constructor(){
        this.taskRepo = new TaskRepository();
    }

    async addTask(data:any, teacherId:string,pdfs?: Express.Multer.File[],images?: Express.Multer.File[]): Promise<{status:number,message:string,data?:ITask}>{
       try {

        if(!teacherId){
            return {status:StatusCode.BadRequest,message:"Teacher Id is required"};
        }

         const pdfUrls: string[]=[];
        const imgUrls: string[]=[];

        if(pdfs && pdfs.length>0){
            for(const file of pdfs){
                const result = await uploadImageToCloudinary(file.buffer)
                pdfUrls.push(result.secure_url);
            }
        }

        if(images && images.length>0){
            for(const file of images){
                const result = await uploadImageToCloudinary(file.buffer)
                imgUrls.push(result.secure_url);
            }
        }

       const classrooms = JSON.parse(data.classrooms || "[]");
const studentIds = JSON.parse(data.students || "[]");

const result = await this.taskRepo.createTask({
  title: data.title,
  description: data.description,
  subject: data.subject,
  assignedDate: new Date(data.assignedDate),
  dueDate: new Date(data.dueDate),
  text: data.text,
  maxMarks: Number(data.maxMarks),
  classrooms,          
  students: studentIds, 
  teacherId,
  attachments: pdfUrls,
  images: imgUrls,
});


        if(!result){
            return {status:StatusCode.InternalServerError,message:"Error while adding task"}
        }
        return {status:StatusCode.Created,message:"Task added successfully",data:result};
       } catch (error) {
        console.log("Error occured while addig task in usecase",error);
        return {status:StatusCode.InternalServerError,message:"Internal server error"};
       }
    }

    async getTasks(data:IGetTasks):Promise<{status:number,message:string,data?:ITask[],totalCount?:number}>{
        try {
            const {limit,page,classroom,taskId,studentId,teacherId} = data
             if (typeof limit !== "number" || limit <= 0) {
      return { status: StatusCode.BadRequest, message: "limit must be a positive number" };
    }

    if (typeof page !== "number" || page <= 0) {
      return { status: StatusCode.BadRequest, message: "page must be a positive number" };
    }

    if (classroom !==undefined && typeof classroom !== "string") {
      return { status: StatusCode.BadRequest, message: "classroom must be a string" };
    }

    if (taskId !==undefined && typeof taskId !== "string") {
      return { status: StatusCode.BadRequest, message: "taskId must be a string" };
    }

    if (studentId !== undefined && typeof studentId !== "string") {
      return { status: StatusCode.BadRequest, message: "studentId must be a string" };
    }

    if (teacherId !== undefined && typeof teacherId !== "string") {
      return { status: StatusCode.BadRequest, message: "teacherId must be a string" };
    }
    
    const tasks = await this.taskRepo.findAllTasks(data)
    if(!tasks){
        return {status:StatusCode.NotFound,message:"No tasks found"}
    }
    return {status:StatusCode.OK,message:"Tasks fetched successfully",data:tasks.tasks,totalCount:tasks.totalCount};
        } catch (error) {
            console.log("Error occured while fetching all tasks in useCase",error)
            return {status:StatusCode.InternalServerError,message:"Internal server error"}
        }
    }

    

 
    async deleteTask(id:string):Promise<{status:number,message:string}>{
        try {
            if(!id || typeof id!=="string"){
                return {status:StatusCode.BadRequest,message:"Invalid input"}
            }
            const deleted = await this.taskRepo.deleteTaskById(id)
            if(!deleted){
                return {status:StatusCode.NotFound,message:"Task not found or Error deleting task"}
            }
            return {status:StatusCode.NoContent,message:"Task deleted successfully"}
        } catch (error) {
            console.log("Error occured while deleting task in use case",error)
            return {status:StatusCode.InternalServerError,message:"Internal server error"}
        }
    }

}