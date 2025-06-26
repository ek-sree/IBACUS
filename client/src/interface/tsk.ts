export interface UploadedFile {
  id?: string;          
  file: File;
  preview?: string | null;
  lastModified?: number;
  lastModifiedDate?: Date;
  name?: string;
  size?: number;
  type?: string;
}

export interface Task {
  id:string;
  title: string;
  description?: string;
  subject: string;
  assignedDate: string;  
  dueDate: string;     
  text: string;
  maxMarks: number | string;
  attachments?: UploadedFile[]; 
  images?: UploadedFile[];     
  students?: string[];   
  classrooms?: string[]; 
}


