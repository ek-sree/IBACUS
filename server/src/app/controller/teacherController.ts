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
             res.status(response.status).json({message:response.message,});
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

}