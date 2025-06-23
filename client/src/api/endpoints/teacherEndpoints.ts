const BASE_URL = import.meta.env.VITE_API_URL;

export const TEACHER_ENDPOINTS = {
  CREATE_STUDENT: `${BASE_URL}/teacher/student-create`,
  GET_ALL_STUDENT: `${BASE_URL}/teacher/get-all-students`,
  DELETE_STUDENT: `${BASE_URL}/teacher/delete-student`,
  EDIT_STUDENT: `${BASE_URL}/teacher/edit-student`,
  GET_STUDENT_CLASS: `${BASE_URL}/teacher/get-student-class`,


  ADD_TASK: `${BASE_URL}/task/add-task`,
  GET_TASKS: `${BASE_URL}/task/get-tasks`,
  DELETE_TASK: `${BASE_URL}/task/delete-task`,

  
  GET_STUDENTS_TASKS: `${BASE_URL}/task/get-students-tasks`,
};
