import { useState } from "react";
import { AUTH_ENDPOINTS } from "../../api/endpoints/authEndpoints";
import Axios from "../../api/axios/axios";

const useMicrosoftLogin = () => {
  const [error,setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const loginWithMicrosoft = async(token:string, role: string) => {
    const endpoint = role === "TEACHER"
        ? AUTH_ENDPOINTS.MS_TEACHER
        : AUTH_ENDPOINTS.MS_STUDENT;
      setLoading(true);
    try{
  const response  = await Axios.post(endpoint, { token,role });
   if(response.status==200){
    return response.data;
  }else{
    setError('something went wrong')
  }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error:any) {
            if (error.response) {
    if (error.response.status === 404) {
      setError(error.response.data.message ||"Invalid credentials"); 
    } else if (error.response.status === 400) {
      setError(error.response.data.message ||"Error occured try later"); 
    } else {
      setError("Something went wrong");
    }
  } else {
    setError("Network Error");
  }
        }finally{
          setLoading(false);
        }
    }

  return {loginWithMicrosoft,error, loading};
}

export default useMicrosoftLogin;