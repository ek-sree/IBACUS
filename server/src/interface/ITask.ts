import { JsonValue } from "../generated/prisma/runtime/library.js";

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

export interface IGetTasks{
    page:number;
    limit:number;
    search?:string;
    sort?:string;
    teacherId?:string;
    classroom?:string;
    studentId?:string;
    taskId?:string;
}

export interface IGetTasks{
    page:number;
    limit:number;
    search?:string;
    sort?:string;
    teacherId?:string;
    classroom?:string;
    studentId?:string;
    taskId?:string;
}