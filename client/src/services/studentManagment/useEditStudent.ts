import { useState } from "react";
import Axios from "../../api/axios/axios";
import { TEACHER_ENDPOINTS } from "../../api/endpoints/teacherEndpoints";
import type { Student } from "./useFetchStudents";

const useEditStudent = () => {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const editStudent = async (id: string, data:Partial<Student>) => {
        try {
            const response = await Axios.put(`${TEACHER_ENDPOINTS.EDIT_STUDENT}/${id}`,data)
            if(response.status==200){
                return response.data;
            }else{
                setError(response.data.message || "Something went wrong");
                return null;
            }
        } catch (error) {
            console.error("Error occured while editing student.",error)
             setError("Something went wrong");
        }finally{
            setLoading(false);
        }
    }

  return {error,loading,editStudent};
}

export default useEditStudent;