const BASE_URL = import.meta.env.VITE_API_URL;

export const STUDENT_ENDPOINTS = {
  CREATE_STUDENT: `${BASE_URL}/STUDENT/student-create`,
  GET_ALL_STUDENT: `${BASE_URL}/teacher/get-all-students`,
  DELETE_STUDENT: `${BASE_URL}/teacher/delete-student`,
  EDIT_STUDENT: `${BASE_URL}/teacher/edit-student`,
  GET_STUDENT_CLASS: `${BASE_URL}/teacher/get-student-class`,

};
