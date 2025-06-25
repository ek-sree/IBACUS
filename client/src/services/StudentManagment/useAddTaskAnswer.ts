import { useState } from "react";
import Axios from "../../api/axios/axios";
import { STUDENT_ENDPOINTS } from "../../api/endpoints/studentEndpoints";

const useAddTaskAnswer = () => {

    const [error,setError] = useState<string|null>(null)
    const [loading,setLoading] = useState<boolean>(false)

    const addTaskAnswer = async(data)=>{
        try {
            console.log("DA",data);
            
            setLoading(true);
            const response = await Axios.post(`${STUDENT_ENDPOINTS.ADD_TASK_ANSWERS}`,data,
                {headers:{'Content-Type':'multipart/form-data'}})
            if(response.status === 201){
                return true;
            }
            else{
               setError(response.data.message || "Error occured while adding task answer")
               return false;
            }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error:any) {
            console.error("Error occured while adding task answer",error)
            setError(error.message || "Unknown error occured while adding tasks");
        }finally{
            setLoading(false);
        }
    }
return{addTaskAnswer,error,loading}
}

export default useAddTaskAnswer;