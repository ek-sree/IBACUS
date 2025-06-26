export interface StudentsData {
  id?:string;
  email: string;
  name: string;
  class: string;
  role?: string;
}

export interface StudentAndClassResult {
  students: StudentsData[];
  className: { value: string; label: string }[];
}


export interface StudentsData{
    email:string,
    name:string,
    class:string,
}

export interface DashboardData {
  studentCount: number;
  taskCount: number;
  totalSubmissions:number;
  averageGradePercentage: number;
  weeklySubmissions: number[];
  topStudents: { name: string; email: string; totalMarks: number }[];
}