import { useEffect, useState } from "react"
import Axios from "../../api/axios/axios"
import { TEACHER_ENDPOINTS } from "../../api/endpoints/teacherEndpoints"

const useFetchStudentTaskBy = (studentId:string,classroom:string) => {
    const [error,setError] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [pendingTasks, setPendingTasks] = useState([])
    const [completedTasks, setCompletedTasks] = useState([])

    const fetchStudentsTask=async()=>{
        
        setLoading(true)
        try {
            const response = await Axios.get(`${TEACHER_ENDPOINTS.GET_STUDENTS_TASKS}?studentId=${studentId}&classroom=${classroom}`)
            
            if(response.status===200){
                setPendingTasks(response.data.pendingTasks || [])
                setCompletedTasks(response.data.completedTasks || [])
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
    },[studentId,classroom])

    return{
        error,
        loading,
        pendingTasks,
        completedTasks
    }
}

export default useFetchStudentTaskBy