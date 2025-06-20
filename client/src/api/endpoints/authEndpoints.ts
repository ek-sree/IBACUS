const BASE_URL = import.meta.env.VITE_API_URL;

export const AUTH_ENDPOINTS = {
  GOOGLE_TEACHER: `${BASE_URL}/auth/google/teacher`,
  GOOGLE_STUDENT: `${BASE_URL}/auth/google/student`,
  MS_TEACHER: `${BASE_URL}/auth/microsoft/teacher`,
  MS_STUDENT: `${BASE_URL}/auth/microsoft/student`,
  LOGOUT: `${BASE_URL}/auth/logout`,
};
