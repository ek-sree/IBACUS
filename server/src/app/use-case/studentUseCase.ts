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

export default class StudentUseCase{
    private studentRepo: StudentRepository;

    constructor(){
        this.studentRepo = new StudentRepository();
    }

    async addTaskAnswer(data:any,pdfs?: Express.Multer.File[],images?: Express.Multer.File[]): Promise<{status:number,message:string,data?:IStudentTaskSubmission}>{
        try {
console.log("JERE",data);

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

}