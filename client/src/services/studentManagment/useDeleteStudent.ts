import {  useState } from "react";
import Axios from "../../api/axios/axios";
import { TEACHER_ENDPOINTS } from "../../api/endpoints/teacherEndpoints";

const useDeleteStudent = () => {
  const [error,setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const deleteStudent = async (id:string) =>{
    setIsLoading(true)
    setError(null)
    try {
        const response = await Axios.delete(`${TEACHER_ENDPOINTS.DELETE_STUDENT}/${id}`)
        if(response.status==204){
            return true;
        }
        else{
            setError(response.data?.message || "Unable to delete student");
            return false;
        }
    } catch (error:any) {
        console.log("Error on deleting student",error);
        setError(error?.response?.data?.message || error?.message || "Something went wrong");
    }finally{
      setIsLoading(false)
    }
  }

  return {deleteStudent,error,isLoading}

}

export default useDeleteStudent;