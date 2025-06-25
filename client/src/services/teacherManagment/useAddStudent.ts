import { useState } from "react";
import Axios from "../../api/axios/axios";
import { TEACHER_ENDPOINTS } from "../../api/endpoints/teacherEndpoints";

interface StudentsData{
    email:string,
    name:string,
    class:string,
}



const useAddStudent = () =>{
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const addStudent = async (data:StudentsData[],teacherId:string)=>{
        try {
            
            setLoading(true);
             const response = await Axios.post(`${TEACHER_ENDPOINTS.CREATE_STUDENT}/${teacherId}`, data);
                
            if(response.status===201){
                return response.data.data;
            }else{
                setError(response.data.message || "Failed to add student")
                return false;
            }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error:any) {
            console.error("Error adding student",error)
            setError(error?.message || "Error adding student");
        }finally{
            setLoading(false);
        }
    }

    return{addStudent,error,loading}

}

export default useAddStudent;