import { useEffect, useState } from "react";
import Axios from "../../api/axios/axios";
import { TEACHER_ENDPOINTS } from "../../api/endpoints/teacherEndpoints";

const useFetchStudentAndClass = (teacherId?:string) => {

    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState(null);
    
    const fetchStudentsAndClasses = async () => {
        try{
            setIsLoading(true)
            const response = await Axios.get(`${TEACHER_ENDPOINTS.GET_STUDENT_CLASS}/${teacherId}`)
            if(response.status==200){
                setData(response.data)
            }else{
                console.log("Error occured while fetching students and class details",response.data.message);
            }
        }catch(err:any){
            setError(err.response.data.message || err.message || 'Something went wrong')
        }finally{
            setIsLoading(false)
        }
    }

useEffect(()=>{
        fetchStudentsAndClasses()
    },[])

  return { data, isLoading,error };

    
}

export default useFetchStudentAndClass;