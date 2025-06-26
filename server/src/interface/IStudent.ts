import { JsonValue } from "../generated/prisma/runtime/library.js";

export interface IStudentTaskSubmission{
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

export interface ITask {
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
