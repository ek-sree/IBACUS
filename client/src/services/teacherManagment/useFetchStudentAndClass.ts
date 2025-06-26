import { useEffect, useState } from "react";
import { TEACHER_ENDPOINTS } from "../../api/endpoints/teacherEndpoints";
import Axios from "../../api/axios/axios";

interface ClassRoom {
  value: string;
  label: string;
}

interface Student {
  id: string;
  name: string;
  class: string;
}

interface FetchStudentAndClassData {
  className: ClassRoom[];
  students: Student[];
}

const useFetchStudentAndClass = (teacherId?: string) => {
  const [data, setData] = useState<FetchStudentAndClassData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  
  const fetchStudentsAndClasses = async () => {
    try {
      setIsLoading(true);
      const response = await Axios.get(`${TEACHER_ENDPOINTS.GET_STUDENT_CLASS}/${teacherId}`);
      
      if (response.status === 200) {
        setData(response.data.data);
      } else {
        console.log("Error occurred while fetching students and class details", response.data.message);
        setError(new Error(response.data.message));
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(new Error(err.response?.data?.message || err.message || 'Something went wrong'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentsAndClasses();
  }, [teacherId]);

  return { data, isLoading, error };
};

export default useFetchStudentAndClass