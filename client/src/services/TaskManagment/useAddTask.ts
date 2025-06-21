import { useState } from "react";
import Axios from "../../api/axios/axios";
import { TEACHER_ENDPOINTS } from "../../api/endpoints/teacherEndpoints";

interface UploadedFile {
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


const useAddTask = () =>{
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const addTask = async (data:FormData,teacherId:string)=>{
        try {
            console.log("Adding task...",data,teacherId);
            
            setLoading(true);
            const response = await Axios.post(`${TEACHER_ENDPOINTS.ADD_TASK}/${teacherId}`,data,{
                headers:{
                    'Content-Type': `multipart/form-data`,
                  }
            })
            if(response.status===201){
                return response.data.task;
            }else{
                setError(response.data.message || "Failed to add task")
                return false;
            }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error:any) {
            console.error("Error adding tasks",error)
            setError(error?.message || "Error adding task");
        }finally{
            setLoading(false);
        }
    }

    return{addTask,error,loading}

}

export default useAddTask;