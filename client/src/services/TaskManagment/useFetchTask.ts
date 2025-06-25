import { useEffect, useState } from "react";
import Axios from "../../api/axios/axios";
import { TEACHER_ENDPOINTS } from "../../api/endpoints/teacherEndpoints";
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


const useFetchTask = (page:number=1,limit:number=5,search?:string,sort?:string,teacherId?:string, classroom?:string, studendId?:string,taskId?:string) => {
  const [tasks,setTasks]=useState<Task[]>([])
  const [loading,setLoading]=useState<boolean>(false);
  const [error,setError]=useState<string|null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);
const fetchTasks = async () => {
  
  setLoading(true);
  try {
    const response = await Axios.get(TASKENDPOINTS.GET_TASKS, {
      params: {
        page,
        limit,
        search,
        sort,
        teacherId,
        classroom,
        studentId: studendId,
        taskId,
      },
    });

    if (response.status === 200) {
      setTasks(response.data.data);
      setTotalCount(response.data.totalCount);
      setError(null);
    }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.response?.status === 404) {
      setTasks([]);
      setTotalCount(0);
      setError(null);
    } else {
      setError(error.message || "Error occurred while fetching tasks");
    }
  } finally {
    setLoading(false);
  }
};


    useEffect(()=>{
      fetchTasks();
    },[page, limit,search, teacherId, classroom, studendId, taskId,sort])

  return {tasks,error,loading,totalCount};
}

export default useFetchTask;