import Axios from "../../api/axios/axios"
import { TEACHER_ENDPOINTS } from "../../api/endpoints/teacherEndpoints"

interface StudentsData{
    email:string,
    name:string,
    class:string,
}

export const createStudent = async (data: StudentsData[], teacherId: string) => {
  try {
    const response = await Axios.post(`${TEACHER_ENDPOINTS.CREATE_STUDENT}/${teacherId}`, data);
    return response;
  } catch (error: any) {
    if (error.response) {
      return error.response; 
    }
    console.error("Unexpected error while creating student", error);
    return { status: 500, data: { message: "Unexpected error occurred" } };
  }
};
