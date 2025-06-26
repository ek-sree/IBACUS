export interface Student {
  id?: string;
  name: string;
  email: string;
  class: string;
  createdAt?:Date;
}


export interface Submission {
  id: string;
  studentId: string;
  name: string;  
  email: string;
  class: string;
  status: string; 
  submittedAt?: string;
  submissionDate?: string;
  marks?: number;
}

export interface StudentAnswer {
  id: string;
  text: string;
  images: string[];
  attachments: string[];
  createdAt: string;
  marks?: number;
  grade:number | null;
}

export interface SubmittedStudent {
  id: string;
  name: string;
  email: string;
  class: string;
  submissionDate: string;
}


export interface UserRowProps {
  user: Student;
  onDelete: (id: string) => void;
  source: string;
}

export interface AddStudentsProps{
  isOpen:boolean;
  onClose:()=>void;
  onSuccess:(response:Student)=>void;
}


export interface StudentSubmissionProps{
  taskId:string,
  totalCount:number,
  loading:boolean,
  error?:string | null,
  page:number,
  limit:number,
  searchTerm:string,
  setPage:(value:number)=>void,
  setLimit:(value:number)=>void,
  setSearchTerm:(value:string)=>void,
  submissions:Submission[]
}


export interface AnswerFormData {
  answer: string;
  attachments: FileItem[] | null;
  images: FileItem[] | null;
}

export interface FileItem {
  file: File;
  id: string;
  preview?: string;
}