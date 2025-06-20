import { useEffect, useState } from "react";
import Axios from "../../api/axios/axios";
import { TEACHER_ENDPOINTS } from "../../api/endpoints/teacherEndpoints";

export interface Student {
  id: string;
  name: string;
  email: string;
  class: number;
}

const useFetchStudents = (
teacherId:string,
  page = 1,
  limit = 5,
  selectedClass?: string,
  searchTerm?: string
) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);
  const [totalCount, setTotalCount] = useState<number>(0);

  useEffect(() => {
    fetchStudents();
  }, [page, limit, selectedClass, searchTerm]);

  const fetchStudents = async () => {
    setLoading(true);
    setError(null);

    try {
      const queryParams = [
        `page=${page}`,
        `limit=${limit}`,
        selectedClass ? `className=${selectedClass}` : "",
        searchTerm ? `search=${encodeURIComponent(searchTerm)}` : "",
        `teacherId=${teacherId}`,
      ]
        .filter(Boolean) 
        .join("&");

      const url = `${TEACHER_ENDPOINTS.GET_ALL_STUDENT}?${queryParams}`;

      const response = await Axios.get(url);
      
      if (response.status === 200) {
        setStudents(response.data.data);
         setTotalCount(response.data.totalCount || 0);
      } else {
        setError(response?.data?.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error occurred while fetching all student data:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };
  
  return { students,totalCount, loading, error, fetchStudents };
};

export default useFetchStudents;
