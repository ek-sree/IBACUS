import { JsonValue } from "../../generated/prisma/runtime/library.js";
import { StatusCode } from "../../interface/statusCode.js";
import { uploadImageToCloudinary } from "../../service/cloudinary.js";
import { TaskAnswerData, taskAnswerSchema } from "../../utils/validation.js";
import { StudentRepository } from "../repository/studentRepository.js";


interface IStudentTaskSubmission{
    id:string;
    taskId:string;
    text:string;
    attachments?:JsonValue;
    images?:JsonValue;
    grade?:number | null;
    studentId:string;
    teacherId:string;
    marks:number;
    status:Boolean;
    createdAt:Date;
}

interface ITask {
  id: string;
  title: string;
  description?: string | null;
  subject: string;
  assignedDate: Date;
  dueDate: Date;
  text?: string | null;
  maxMarks: number;
  attachments?: JsonValue; 
  images?: JsonValue;      
  classrooms?: JsonValue;  
  students?: JsonValue;    
  teacherId: string;
  createdAt: Date;
}

  interface FindTasksOptions {
  studentId: string;
  searchTerm?: string;
  sortBy?: string;
  page?: number;
  itemsPerPage?: number;
  status?: "pending" | "completed";
}


export default class StudentUseCase{
    private studentRepo: StudentRepository;

    constructor(){
        this.studentRepo = new StudentRepository();
    }


    async getTasksByStudent( studentId:string,
  searchTerm = "",
  sortBy = "",
  page = 1,
  itemsPerPage = 10,
  status:string):Promise<{status:number,message:string,task?: ITask[],totalCount?:number,totalTaskCount?:number,completedCount?:number,pendingCount?:number,dueSoonCount?:number}>{
        try {
            
            const tasks = await this.studentRepo.findTasksByStudent(studentId,searchTerm,sortBy,page,itemsPerPage,status)
            if(!tasks){
                return {status:StatusCode.NotFound,message:"No tasks found"}
            }
            
            return {status:StatusCode.OK,message:"Tasks fetched successfully",task:tasks.tasks,totalCount:tasks.totalCount,totalTaskCount:tasks.totalTaskCount, completedCount:tasks.completedCount, pendingCount:tasks.pendingCount, dueSoonCount:tasks.dueSoonCount};
        } catch (error) {
            console.log("error occured while fetching data using student in usecase",error);
            return {status:StatusCode.InternalServerError,message:"Internal server error"}
        }
    }

    async addTaskAnswer(data:any,pdfs?: Express.Multer.File[],images?: Express.Multer.File[]): Promise<{status:number,message:string,data?:IStudentTaskSubmission}>{
        try {

            const parseResult = taskAnswerSchema.safeParse(data);
      if (!parseResult.success) {
        return {
          status: StatusCode.BadRequest,
          message: parseResult.error.issues.map((issue) => issue.message).join(", "),
        };
      }

      const validData: TaskAnswerData = parseResult.data

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
                   const newData = {
                       ...validData,
                       attachments:pdfUrls,
                       images:imgUrls,
                   }
                    const result = await this.studentRepo.AddTaskAnswer(newData)
            
                    if(!result){
                        return {status:StatusCode.InternalServerError,message:"Error while adding task"}
                    }
                    return {status:StatusCode.Created,message:"Task added successfully",data:result};
        } catch (error) {
            console.log("Error occure while addind tasks answers in student use case",error)
            return {status:StatusCode.InternalServerError,message:"Internal Server Error"}
        }
    }

    async getDashboardData(studentId:string):Promise<{status:number,message:string,data?:any}>{
        try {
            if(!studentId){
                return {status:StatusCode.BadRequest,message:"Invalid request"}
            }
            const result = await this.studentRepo.getStudentDashboard(studentId)
            if(!result){
                return {status:StatusCode.InternalServerError,message:"Error while fetching data"}
            }
            return {status:StatusCode.OK,message:"Dashboard data fetched successfully",data:result};
        } catch (error) {
            console.log("Error occured while fetching student dashboard data from usecase",error)
            return {status:StatusCode.InternalServerError,message:"Internal Server Error"}
        }
    }

}