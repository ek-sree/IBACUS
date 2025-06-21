import { useState } from "react";
import Axios from "../../api/axios/axios";
import { TEACHER_ENDPOINTS } from "../../api/endpoints/teacherEndpoints";

const useDeleteTask = () => {
    const [error,setError] = useState<string>("")
    const [loading,setLoading] = useState<boolean>(false)

    const deleteTask = async (id:string) =>{
        setLoading(true)
            setError("")
        try {
            const response = await Axios.delete(`${TEACHER_ENDPOINTS.DELETE_TASK}/${id}`)
            if(response.status==204){
            return true;
        }
        else{
            setError(response.data?.message || "Unable to delete task");
            return false;
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error:any) {
            console.error("Error occured while  deleting task",error);
            setError("Error occured while deleting task");
        }finally{
            setLoading(false)
        }
    }

    return{deleteTask,error,loading}
}

export default useDeleteTask;