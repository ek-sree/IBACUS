import { StatusCode } from "../../interface/statusCode.js";
import { validateEmail } from "../../utils/validation.js";
import { TeacherRepository } from "../repository/teacherRepository.js";

interface StudentsData {
  id?:string;
  email: string;
  name: string;
  class: string;
  role?: string;
}

interface StudentAndClassResult {
  students: StudentsData[];
  className: { value: string; label: string }[];
}


export class TeacherUseCase {
  private repository: TeacherRepository;

  constructor() {
    this.repository = new TeacherRepository();
  }

  async addStudents(data: StudentsData[], teacherId: string):Promise<{status:number,message:string,data?:StudentsData[]}> {
    try {      
        const existingStudents = await this.repository.findAllStudents();

    const existingEmails = new Set(existingStudents.map((s) => s.email));

    const duplicate = data.find((s) => existingEmails.has(s.email));

    if (duplicate) {
      return {status:StatusCode.BadRequest, message: `Duplicate Email: ${duplicate.email}`}
    }
    const role = "student";
    const result = await this.repository.createStudent(data, teacherId, role);
    if(!result){
      return {status:StatusCode.BadRequest, message:"Unable to create students"};
    }
    return { status: StatusCode.Created, message: `Successfully added student ${result.count}` ,data };
    } catch (error:any) {
        console.log("Error while addStudent",error)
        return { status: StatusCode.InternalServerError, message:error.message };
    }
  }

  async fetchAllStudents(teacherId:string,pageNumber:number,limit:number,className?:string,search?:string): Promise<{status: number;message: string;data?: StudentsData[];totalCount?:number}> {
    try {
      const result = await this.repository.findAllStudents(teacherId,pageNumber,limit,className,search);
      const total = await this.repository.countStudents(teacherId,className,search)
      
      if(!result){
        return {status :StatusCode.NotFound,message:"No students found"}
      }
      return {status:StatusCode.OK,message:"Success",data:result,totalCount:total || 0};
    } catch (error) {
      console.log("Error in fetching all students in useCase",error);
      return {status:StatusCode.InternalServerError,message:"Internal server error"};
    }
  }

  async deleteStudent(id:string):Promise<{status:number,message:string}>{
    try {
      const result = await this.repository.deleteStudent(id);
      if(!result){
        return {status:StatusCode.InternalServerError,message:`Cant delete this student error occured`}
      }
      return {status:StatusCode.NoContent,message:`Deleted Student successfully`}
    } catch (error) {
      console.log("Error in deleting student in usecase",error);
      return {status:StatusCode.InternalServerError,message:"Internal server error"};
    }
  }

  async updateStudent(studentId:string, email:string,name:string,className:string):Promise<{status:number,message:string,data?:StudentsData}>{
    try {
      const emailValidate = validateEmail(email);
      if(!emailValidate || !name.trim() || !className.trim() || !studentId.trim()){
        return {status:StatusCode.BadRequest,message:"Invalid input"}
      }
      const result = await this.repository.updateStudent(studentId,email,name,className);
      if(!result){
        return {status:StatusCode.InternalServerError,message:"Unable to update student"};
      }
      return {status:StatusCode.OK,message:"Updated Successfully",data:result};
    } catch (error) {
      console.log("Error in updating student in usecase",error);
      return {status:StatusCode.InternalServerError,message:"Internal server error"};
    }
  }

  async getStudentsAndClass(teacherId?:string):Promise<{status:number,message:string,data?:StudentAndClassResult}>{
    try {
      const result = await this.repository.findStudentAndClass(teacherId);
      if(!result){
        return {status:StatusCode.InternalServerError,message:"Unable to get students and classes"};
      }
      return {status:StatusCode.OK,message:"Success",data:result};
    } catch (error) {
      console.log("Error getting students and class in teacherUsecase")
      return {status:StatusCode.InternalServerError,message:"Internal server error"};
    }
  }
}
