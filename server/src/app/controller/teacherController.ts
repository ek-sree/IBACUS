import { Request, Response } from "express";
import { StatusCode } from "../../interface/statusCode.js";
import { TeacherUseCase } from "../use-case/teacherUseCase.js";

export default class TeacherController{
    private teacherUseCase:TeacherUseCase;

    constructor(){
        this.teacherUseCase = new TeacherUseCase();
    }
    
createStudents = async(req:Request, res:Response)=>{
        try {
            const data = req.body;
            
            const teacherId = req.params.teacherId;
            if(!data || !teacherId){
                 res.status(StatusCode.BadRequest).json({message:"Bad request"});
                 return
            }
            const response = await this.teacherUseCase.addStudents(data,teacherId);
             res.status(response.status).json({message:response.message,data:response.data});
        } catch (error) {
            console.log("Error while creating students in teacherController",error)
            res.status(StatusCode.InternalServerError).json({message:"Internal server Error"});
        }
    }
  

    findAllStudents = async(req:Request, res:Response)=>{
        try {
            const {teacherId,page,limit,className,search} = req.query;
            const pageNumber = Number(page) || 1;
            const limitValue = Number(limit) || 5;
            const teacherIdStr = typeof teacherId === 'string' ? teacherId : '';
            const classNameStr = typeof className === 'string' ? className : undefined;
            const searchStr = typeof search === 'string' ? search : undefined;
            const response = await this.teacherUseCase.fetchAllStudents(teacherIdStr,pageNumber,limitValue,classNameStr,searchStr);
            
            res.status(response.status).json({message:response.message,data:response.data,totalCount:response.totalCount});
        } catch (error) {
            console.log("Error while fetching all students in teacherController",error);
            res.status(StatusCode.InternalServerError).json({message:"Internal server Error"});
        }
    }

    studentDelete = async(req:Request,res:Response)=>{
        try {
            const id = req.params.id;
            const response = await this.teacherUseCase.deleteStudent(id);
            res.status(response.status).json({message:response.message});
        } catch (error) {
            console.log("Error occured while deleting student in controller",error);
            res.status(StatusCode.InternalServerError).json({message:"Internal Server error"});
        }
    }

    editStudent= async(req:Request,res:Response)=>{
        
        try {
            const id = req.params.id;
            const {email,name,class:className} = req.body;
            
            const response = await this.teacherUseCase.updateStudent(id,email,name,className)
            res.status(response.status).json({message:response.message,data:response.data});
        } catch (error) {
            console.log("Error occured while editing student in controller",error);
            res.status(StatusCode.InternalServerError).json({message:"Internal Server error"});
        }
    }

    getStudentsAndClasses = async(req:Request,res:Response)=>{
        try {
            const teacherId = req.params.teacherId as string;
            const response = await this.teacherUseCase.getStudentsAndClass(teacherId);
            res.status(response.status).json({message:response.message,data:response.data});
        } catch (error) {
            console.log("Error occured while getting students and calss in controller",error)
            res.status(StatusCode.InternalServerError).json({message:"Internal Server error"})
        }
    }

    getStudentByTaskId= async(req:Request,res:Response)=>{
        try {
            const taksId = req.query.taskId as string;
            const page = Number(req.query.page)||1;
            const limit = Number(req.query.limit)||5;
            const search = req.query.searchTerm as string|undefined;
            const response = await this.teacherUseCase.getStudentsByTaskId(taksId,page,limit,search);
            
            res.status(response.status).json({message:response.message,data:response.data,totalCount:response.totalCount});
        } catch (error) {
            console.log("Error occured while getting students by taskId",error);
            res.status(StatusCode.InternalServerError).json({message:"Internal Server error"})
        }
    }

    getSubmissionAnswers = async(req:Request,res:Response)=>{
        console.log("LOF");
        
        try {
            const taskId = req.params.taskId as string;
            const studentId = req.params.studentId as string;
            const response = await this.teacherUseCase.getSubmissionAnswer(taskId,studentId);
            res.status(response.status).json({message:response.message,data:response.data});
        } catch (error) {
            console.log("Error occured while fetching submission answer from controller",error)
            res.status(StatusCode.InternalServerError).json({message:"Internal Server error"})
        }
    }


    addSubmissionGrade = async(req:Request,res:Response)=>{
        try {
            
            const id = req.params.id as string;
            const grade = Number(req.body.grade);
            
            const result = await this.teacherUseCase.addSubmissionGrade(id,grade);
            res.status(result.status).json({message:result.message})
        }catch(error){
            console.log("Error occured while adding submission grade from controller",error)
            res.status(StatusCode.InternalServerError).json({message:"Internal Server error"})
        }
    }

    getDashboardData = async(req:Request,res:Response)=>{
        try {
            const teacherId = req.params.teacherId as string;

            const result = await this.teacherUseCase.getDashboardInfo(teacherId)
            console.log("RESSSSSSSSS",result);
            
            res.status(result.status).json({message:result.message,data:result.data})
        } catch (error) {
            console.log("Error occured while fetching dashboard data from controller",error)
            res.status(StatusCode.InternalServerError).json({messsage:"Internal server error"})
        }
    }

}