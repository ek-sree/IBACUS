import Axios from "../../api/axios/axios";
import { AUTH_ENDPOINTS } from "../../api/endpoints/authEndpoints";

export const handleGoogleLogin = async (code: string, isTeacher: boolean) => {
  const endpoint = isTeacher
    ? AUTH_ENDPOINTS.GOOGLE_TEACHER
    : AUTH_ENDPOINTS.GOOGLE_STUDENT;

  const response  = await Axios.post(endpoint, { code });
  return response;
};
