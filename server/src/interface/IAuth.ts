export type AuthUser = Teacher | Student;

export interface Teacher {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar: string;
  createdAt: Date;
  status: boolean;
}

export interface Student {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar: string | null;  
  createdAt: Date;
  status: boolean;
  class: string;
  teacherId: string;
}

export enum Role {
  TEACHER = "TEACHER",
  STUDENT = "STUDENT",
}