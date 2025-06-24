import { useEffect, useState } from "react";
import Axios from "../../api/axios/axios";
import { TEACHER_ENDPOINTS } from "../../api/endpoints/teacherEndpoints";

const useFetchStudentsByTaskId = (taskId: string,page:number=1,limit:number=5,searchTerm?:string) => {
    console.log("searchAPIS",searchTerm);
    
  const [data,setData] = useState([])
  const [ totalCount, setTotalCount] = useState<number>(0);
  const [loading,setLoading] = useState<boolean>(false)
  const [error,setError] = useState<string | null>(null)

  const fetchStudentsByTaskId = async () => {
    setLoading(true);
    try {
        
        const response = await Axios.get(`${TEACHER_ENDPOINTS.GET_STUDENT_BY_TASKID}`,{
            params:{
                taskId,
                page,
                limit,
                searchTerm
            }
        })
        
        if(response.status === 200){
            setData(response.data.data)
            setTotalCount(response.data.totalCount);
        } else {
          console.error(`Failed to fetch students by task id. Status code ${response.status}`);
          setError(response.data.message || `Failed to fetch students by task id.`)
        }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error:any) {
        console.error("Error occured while fetching students by taskId")
        setError(error.message || "Error occured while fetching students by taskId")
    }finally{
        setLoading(false);
    }
  }

  useEffect(()=>{
    fetchStudentsByTaskId();
  },[taskId,page,limit,searchTerm])

  return { data,totalCount, loading, error };

}

export default useFetchStudentsByTaskId;