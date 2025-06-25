const BASE_URL = import.meta.env.VITE_API_URL;

export const TEACHER_ENDPOINTS = {
  CREATE_STUDENT: `${BASE_URL}/teacher/student-create`,
  DELETE_STUDENT: `${BASE_URL}/teacher/delete-student`,
  EDIT_STUDENT: `${BASE_URL}/teacher/edit-student`,
  GET_STUDENT_ANSWER: `${BASE_URL}/teacher/get-student-answer`,
  GET_STUDENT_BY_TASKID: `${BASE_URL}/teacher/get-student-by-taskid`,
  ADD_SUBMISSION_GRADE: `${BASE_URL}/teacher/add-submission-grade`,


  GET_ALL_STUDENT: `${BASE_URL}/teacher/get-all-students`,
  GET_STUDENT_CLASS: `${BASE_URL}/teacher/get-student-class`,


  GET_DASHBOARD_INFO: `${BASE_URL}/teacher/teacher-dashboard`
  
};
