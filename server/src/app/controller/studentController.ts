import { Request, Response } from "express";
import StudentUseCase from "../use-case/studentUseCase.js";
import { StatusCode } from "../../interface/statusCode.js";

export class StudentController{
    private studentUseCase : StudentUseCase;

    constructor(){
        this.studentUseCase = new StudentUseCase();
    }


     getTasksByStudent = async(req:Request,res:Response)=>{
    try {
      const studentId = req.query.studentId as string
      const searchTerm = req.query.searchTerm as string
      const sortBy = req.query.sortBy as string
      const page = Number(req.query.page) || 1;
      const itemsPerPage = Number(req.query.itemsPerPage) || 10;
      const status = req.query.status as string
      
      const result=await this.studentUseCase.getTasksByStudent(studentId,  searchTerm ,
  sortBy ,
  page ,
  itemsPerPage ,
  status)  

      res.status(result.status).json({message:result.message,task:result.task,totalCount:result.totalCount,totalTaskCount:result.totalTaskCount,completedCount:result.completedCount,pendingCount:result.pendingCount,dueSoonCount:result.dueSoonCount})
    } catch (error) {
      console.log("Error occured while fetching task by student in controller",error)
      res.status(StatusCode.InternalServerError).json({message:"Internal Server Error"})
    }
  }

    addTaskAnswer = async(req:Request, res:Response)=>{
        console.log("IVIDE");
        
        try {
            const data = req.body;
            const files = req.files as Record<string, Express.Multer.File[]>;
            const pdfs = files?.attachments;
            const images = files?.images;
            data.marks =  Number(data.marks);

            const result = await this.studentUseCase.addTaskAnswer(data,pdfs,images);
            res.status(result.status).json({message:result.message,data:result.data})
        } catch (error) {
            console.log("Error occured while addind student task answer in student controller",error)
            res.status(StatusCode.InternalServerError).json({message:"Internal Server Error"});
        }
    }


    fetchDashboardData = async(req:Request,res:Response)=>{
      try {
        const studentId = req.params.id as string;
        const result = await this.studentUseCase.getDashboardData(studentId)
        res.status(result.status).json({message:result.message,data:result.data})
      } catch (error) {
        console.log("Error occured while fetching dashboard data in student controller",error);
        res.status(StatusCode.InternalServerError).json({message:"Internal Server Error"})
      }
    }
}