import { Request, Response } from "express";
import StudentUseCase from "../use-case/studentUseCase.js";
import { StatusCode } from "../../interface/statusCode.js";

export class StudentController{
    private studentUseCase : StudentUseCase;

    constructor(){
        this.studentUseCase = new StudentUseCase();
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
}