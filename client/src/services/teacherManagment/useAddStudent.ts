import { useState } from "react";
import Axios from "../../api/axios/axios";
import { TEACHER_ENDPOINTS } from "../../api/endpoints/teacherEndpoints";

interface StudentsData{
    email:string,
    name:string,
    class:string,
}

interface ApiError {
  message?: string;
  response?: {
    data?: {
      message?: string;
    };
  };
}



const useAddStudent = () => {
    const [error, setError] = useState<ApiError | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

   const addStudent = async (data: StudentsData[], teacherId: string) => {
  try {
    setError(null);
    setLoading(true);
    const response = await Axios.post(
      `${TEACHER_ENDPOINTS.CREATE_STUDENT}/${teacherId}`, 
      data
    );

    if (response.status === 201) {
      return { success: true, data: response.data.data };
    } else {
      const errMessage = response.data.message || "Failed to add student";
      setError({ message: errMessage });
      return { success: false, error: errMessage };
    }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    let errorMessage = "Error adding student";

    if (error.response) {
      errorMessage = error.response.data?.message || error.message;
    } else if (error.request) {
      errorMessage = "No response from server";
    } else {
      errorMessage = error.message;
    }

    setError({ message: errorMessage }); // Save in state for UI
    return { success: false, error: errorMessage }; // Also return the error message
  } finally {
    setLoading(false);
  }
};


    return { addStudent, error, loading };
}

export default useAddStudent;