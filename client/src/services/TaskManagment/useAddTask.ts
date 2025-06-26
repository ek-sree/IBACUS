import { useState } from "react";
import Axios from "../../api/axios/axios";
import { TASKENDPOINTS } from "../../api/endpoints/taskEndpoints";

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
            
            setLoading(true);
            const response = await Axios.post(`${TASKENDPOINTS.ADD_TASK}/${teacherId}`,data,{
                headers:{
                    'Content-Type': `multipart/form-data`,
                  }
            })
            
            if(response.status===201){
                return response.data;
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