import { StudentAndClassResult, StudentsData } from "../../interface/ITeacher.js";
import { StatusCode } from "../../interface/statusCode.js";
import { validateEmail } from "../../utils/validation.js";
import { TeacherRepository } from "../repository/teacherRepository.js";


export class TeacherUseCase {
  private teacherRepo: TeacherRepository;

  constructor() {
    this.teacherRepo = new TeacherRepository();
  }

 async  addStudents(
  data: StudentsData[],
  teacherId: string
): Promise<{ status: number; message: string; data?: StudentsData[] }> {

  if(!teacherId){
    return {
      status: StatusCode.BadRequest,
      message: "Teacher id is required",
    };
  }

  const result = await this.teacherRepo.createStudent(data, teacherId, "student");

  if (!result.success) {
    return {
      status: StatusCode.BadRequest,
      message: result.error || "Unable to create students"
    };
  }

  return {
    status: StatusCode.Conflict,
    message: `Successfully added ${result.count} student(s)`,
    data: result.data
  };
}


  async fetchAllStudents(teacherId:string,pageNumber:number,limit:number,className?:string,search?:string): Promise<{status: number;message: string;data?: StudentsData[];totalCount?:number}> {
    try {

      if(!teacherId){
        return {status:StatusCode.BadRequest,message:"Teacher id is required"}
      }

      const result = await this.teacherRepo.findAllStudents(teacherId,pageNumber,limit,className,search);
      const total = await this.teacherRepo.countStudents(teacherId,className,search)
      
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
      if(!id){
        return {status:StatusCode.BadRequest,message:"Invalid input"}
      }
      const result = await this.teacherRepo.deleteStudent(id);
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
      const result = await this.teacherRepo.updateStudent(studentId,email,name,className);
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
      const result = await this.teacherRepo.findStudentAndClass(teacherId);
      if(!result){
        return {status:StatusCode.InternalServerError,message:"Unable to get students and classes"};
      }
      return {status:StatusCode.OK,message:"Success",data:result};
    } catch (error) {
      console.log("Error getting students and class in teacherUsecase")
      return {status:StatusCode.InternalServerError,message:"Internal server error"};
    }
  }

  async getStudentsByTaskId(taksId:string,page:number,limit:number,search?:string):Promise<{status:number,message:string,data?:StudentsData[],totalCount?:number}>{
    try {
      if(!taksId){
        return {status:StatusCode.BadRequest,message:"Invalid Task Id"}
      }
      const result = await this.teacherRepo.findStudentsByTaskId(taksId,page,limit,search);
      if(!result){
        return {status:StatusCode.InternalServerError,message:"Unable to get students by taskId"};
      }
      return {status:StatusCode.OK,message:"Success",data:result.data, totalCount:result.totalCount};
    } catch (error) {
      console.log("Error getting students by taskid in teacherusecase",error)
      return {status:StatusCode.InternalServerError,message:"Internal server error"};
    }
  }

  async getSubmissionAnswer(taskId:string,studendId:string):Promise<{status:number,message:string,data?:any}>{
    try {
      
      if(!taskId.trim() || !studendId.trim() ){
        return {status:StatusCode.BadRequest,message:"Invalid Input"};
      }
      const result = await this.teacherRepo.findSubmittedAnswer(taskId,studendId);
      return {status:StatusCode.OK,message:"Success",data:result};
    } catch (error) {
      console.log("Error getting submission answer in teacherusecase",error);
      return {status:StatusCode.InternalServerError,message:"Internal server error"};
    }
  }

  async addSubmissionGrade(id:string,grade:number):Promise<{status:number,message:string}>{
    try {
      if(!id.trim() || isNaN(Number(grade))){
        return {status:StatusCode.BadRequest,message:"Invalid Input"};
      }
      const result = await this.teacherRepo.addSubmissionGrade(id,grade);
      if(!result){
        return {status:StatusCode.InternalServerError,message:"Unable to add grade"};
      }
      return {status:StatusCode.NoContent,message:"Added Grade"};
    } catch (error) {
      console.log("Error adding grade in teacherusecase",error);
      return{status:StatusCode.InternalServerError,message:"Internal server error"}
    }
  }

  async getDashboardInfo(teacherId:string):Promise<{status:number, message:string,data?:any}>{
    try {

      if(!teacherId){
        return{status:StatusCode.BadRequest,message:"Invalid Input"}
      }

      const result = await this.teacherRepo.findDashboardDetails(teacherId)
      
      if(!result){
        return{status:StatusCode.BadRequest, message:"No data found"}
      }
      return{status:StatusCode.OK,message:"Data found success",data:result}
    } catch (error) {
      console.log("Error occured while fetching teacher dashboard in useCase",error);
      return {status:StatusCode.InternalServerError,message:"Internal Server Error"}
    }
  }
}
