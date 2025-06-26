const BASE_URL = import.meta.env.VITE_API_URL;

export const STUDENT_ENDPOINTS = {

  GET_STUDENTS_TASKS: `${BASE_URL}/student/get-students-tasks`,
  ADD_TASK_ANSWERS: `${BASE_URL}/student/add-task-answers`,
  STUDENT_DASHBOARD: `${BASE_URL}/student/student-dashboard`,
};