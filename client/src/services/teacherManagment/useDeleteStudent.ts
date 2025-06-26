import {  useState } from "react";
import Axios from "../../api/axios/axios";
import { TEACHER_ENDPOINTS } from "../../api/endpoints/teacherEndpoints";

const useDeleteStudent = () => {
  const [error,setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const deleteStudent = async (id:string) =>{
    setError(null)
    setIsLoading(true)
    try {
        const response = await Axios.delete(`${TEACHER_ENDPOINTS.DELETE_STUDENT}/${id}`)
        if(response.status==204){
            return true;
        }
        else{
            setError("Unable to delete student");
            return false;
        }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error:any) {
        console.log("Error on deleting student",error);
        setError( "Something went wrong");
    }finally{
      setIsLoading(false)
    }
  }
 const resetError = () => setError(null);
  return {deleteStudent,error,isLoading,resetError}

}

export default useDeleteStudent;