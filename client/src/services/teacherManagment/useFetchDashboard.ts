import { useEffect, useState } from "react";
import Axios from "../../api/axios/axios";
import { TEACHER_ENDPOINTS } from "../../api/endpoints/teacherEndpoints";

interface DashboardData {
  studentCount: number;
  taskCount: number;
  totalSubmissions:number;
  averageGradePercentage: number;
  weeklySubmissions: number[];
  topStudents: { name: string; email: string; totalMarks: number }[];
}

const useFetchDashboard = (teacherId: string) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<DashboardData | null>(null);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const response = await Axios.get(`${TEACHER_ENDPOINTS.GET_DASHBOARD_INFO}/${teacherId}`);
      console.log("RES das", response.data.data);
      if (response.status === 200) {
        setData(response.data.data); 
      }
    } catch (error: any) {
      console.error("Error occurred while fetching teacher dashboard", error);
      setError(error?.message || "An error occurred, please log in and try again!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (teacherId) {
      fetchDashboard();
    }
  }, [teacherId]);

  return { error, loading, data };
};

export default useFetchDashboard;