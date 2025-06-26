import { useState } from "react";
import Axios from "../../api/axios/axios";
import { TEACHER_ENDPOINTS } from "../../api/endpoints/teacherEndpoints";

const useAddSubmissionGrade = () => {
  const [error,setError] = useState<string|null>(null)
  const [loading, setLoading] = useState<boolean>(false);

  const addSubmissionGrade = async (submissionId: string, grade:string) => {
    try{
      setError(null);
      setLoading(true);
      const response = await Axios.post(`${TEACHER_ENDPOINTS.ADD_SUBMISSION_GRADE}/${submissionId}`,{grade})
      if(response.status === 204){
        return true;
      }else{
        setError(response.data.message||"Something went wrong");
        return false;
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }catch(err:any){
      console.log("err occured while adding submission grade", err);
      setError(err.message || "Error Occured While Adding Submission Grade");
    }finally{
      setLoading(false);
    }
  }

  return {addSubmissionGrade,error,loading};
}

export default useAddSubmissionGrade;