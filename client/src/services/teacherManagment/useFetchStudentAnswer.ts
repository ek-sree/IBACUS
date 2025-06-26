import { useEffect, useState } from "react";
import Axios from "../../api/axios/axios";
import { TEACHER_ENDPOINTS } from "../../api/endpoints/teacherEndpoints";
import type { StudentAnswer } from "../../interface/student";



const useFetchStudentAnswer = (taskId: string,studentId:string) => {
    const [studentAnswers, setStudentAnswers] = useState<StudentAnswer | null>();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchStudentAnswer= async()=>{
        
        setLoading(true);   
        try {
            const response = await Axios.get(`${TEACHER_ENDPOINTS.GET_STUDENT_ANSWER}/${taskId}/${studentId}`)
            
            if(response.status===200){
                setStudentAnswers(response.data.data)
            }else{
                setError(response.data.message || "Could'nt get data")
                return
            }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error:any) {
            console.error("Error occured while fetching student answer",error)
            setError(error.response?.data.message || error.message || "Something went wrong")
        }finally{
            setLoading(false)
        }
    } 

    useEffect(()=>{
        fetchStudentAnswer()
    },[taskId,studentId])

    return{studentAnswers,error,loading}
}

export default useFetchStudentAnswer;