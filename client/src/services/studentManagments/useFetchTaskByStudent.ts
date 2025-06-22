import { useEffect, useState } from "react"
import Axios from "../../api/axios/axios"
import { TEACHER_ENDPOINTS } from "../../api/endpoints/teacherEndpoints"

const useFetchTaskByStudent = (studentId:string) => {
    const [error,setError] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [data, setData] = useState<any[]>([])

    const fetchTaskByStudent=async()=>{
        
        setLoading(true)
        try {
            const response = await Axios.get(`${TEACHER_ENDPOINTS.GET_TASK_BT_STUDENT}?studentId=${studentId}`)
            if(response.status===200){
                setData(response.data.data)
            }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error:any) {
            console.error("Error occured while fetching task with studentId",error)
            setError(error.message || 'An unknown error occurred')
        }finally{
            setLoading(false)
        }
    }

    useEffect(()=>{
        fetchTaskByStudent()
    },[studentId])

    return{
        error,
        loading,
        data
    }
}

export default useFetchTaskByStudent