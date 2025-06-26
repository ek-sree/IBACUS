import { useEffect, useState } from "react"
import Axios from "../../api/axios/axios"
import { STUDENT_ENDPOINTS } from "../../api/endpoints/studentEndpoints"

const useFetchTaskByStudent = (studentId:string,searchTerm:string,sortBy:string,activeTab:string,currentPage:number,itemsPerPage:number) => {
    const [error,setError] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [tasks, setTasks] = useState([])
    const [totalCount, setTotalCount] = useState<number>(1)
    const[totalTaskCount,setTotalTaskCount] = useState<number>(1)
    const [completedCount,setCompletedCount] = useState<number>(1)
    const [pendingCount,setPendingCount] = useState<number>(1)
    const [dueSoonCount,setDueSoonCount] = useState<number>(1)
    const fetchStudentsTask=async()=>{
        
        setLoading(true)
        try {
          const response = await Axios.get(
  `${STUDENT_ENDPOINTS.GET_STUDENTS_TASKS}?studentId=${studentId}&searchTerm=${searchTerm}&sortBy=${sortBy}&status=${activeTab}&page=${currentPage}&itemsPerPage=${itemsPerPage}`
);
            
            if(response.status===200){
                setTasks(response.data.task || [])
                setTotalCount(response.data.totalCount || 0)
                setTotalTaskCount(response.data.totalTaskCount || 0)
                setCompletedCount(response.data.completedCount || 0)
                setPendingCount(response.data.pendingCount || 0)
                setDueSoonCount(response.data.dueSoonCount || 0)
            }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error:any) {
            console.error("Error occured while fetching task with classroom",error)
            setError(error.message || 'An unknown error occurred')
        }finally{
            setLoading(false)
        }
    }

    useEffect(()=>{
        fetchStudentsTask()
    },[studentId,searchTerm,sortBy,activeTab,currentPage,itemsPerPage])

    return{
        error,
        loading,
        tasks,
        totalCount,
        totalTaskCount,
        completedCount,
        pendingCount,
        dueSoonCount
    }
}

export default useFetchTaskByStudent