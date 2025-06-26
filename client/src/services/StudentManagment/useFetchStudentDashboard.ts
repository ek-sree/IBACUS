import { useEffect, useState } from "react";
import Axios from "../../api/axios/axios";
import { STUDENT_ENDPOINTS } from "../../api/endpoints/studentEndpoints";

interface Task {
  id: string;
  title: string;
  subject: string;
  createdAt: string;
  // Add other task properties as needed
}

interface TaskDetail {
  id: string;
  task: Task;
  subject: string;
  status: 'completed' | 'pending' | string;
  grade: number | null;
  // Add other task detail properties as needed
}

interface DashboardData {
  totalTask: number;
  completedTask: number;
  pendingCount: number;
  taskDetails: TaskDetail[];
  currentWeekTaskSubmission: number;
  currentWeekTaskCount: number;
  totalGrade: number;
  totalGradeThisWeek?: number;
}

const useFetchStudentDashboard = (studentId:string) => {
    const [data,setData] = useState<DashboardData | null>(null)
    const [loading,setLoading] = useState<boolean>(false)
    const [error,setError] = useState<null | string>(null)

    const fetchDashboardData = async ()=>{
        try {
            setLoading(true);
            const response = await Axios.get(`${STUDENT_ENDPOINTS.STUDENT_DASHBOARD}/${studentId}`)
            if(response.status === 200){
                setData(response.data.data)
            }else{
                setError(response.data.message || "Something went wrong!")
            }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error:any) {
            console.error("Error occured while fetching student dashboard data",error)
            setError(error.message || "Something went wrong!")
        }finally{
            setLoading(false)
            setError(null);
        }
    }

    useEffect(()=>{
      fetchDashboardData();
    },[studentId])

  return { data,error,loading };
}

export default useFetchStudentDashboard;