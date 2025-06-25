import { useEffect, useState } from "react";
import Axios from "../../api/axios/axios";
import { STUDENT_ENDPOINTS } from "../../api/endpoints/studentEndpoints";

const useFetchStudentDashboard = (studentId:string) => {
    const [data,setData] = useState()
    const [loading,setLoading] = useState<boolean>(false)
    const [error,setError] = useState<null | string>(null)

    const fetchDashboardData = async ()=>{
        try {
            setLoading(true);
            const response = await Axios.get(`${STUDENT_ENDPOINTS.STUDENT_DASHBOARD}/${studentId}`)
            if(response.status === 200){
                setData(response.data)
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