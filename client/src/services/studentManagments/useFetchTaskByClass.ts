import { useEffect, useState } from "react"
import Axios from "../../api/axios/axios"
import { TEACHER_ENDPOINTS } from "../../api/endpoints/teacherEndpoints"

const useFetchTaskByClass = (classroom:string) => {
    const [error,setError] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [data, setData] = useState<any[]>([])

    const fetchTaskByClass=async()=>{
        
        setLoading(true)
        try {
            const response = await Axios.get(`${TEACHER_ENDPOINTS.GET_TASK_BY_CLASS}?classroom=${classroom}`)
            if(response.status===200){
                setData(response.data.data)
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
        fetchTaskByClass()
    },[classroom])

    return{
        error,
        loading,
        data
    }
}

export default useFetchTaskByClass