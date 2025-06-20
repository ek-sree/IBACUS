import Axios from "../../api/axios/axios";
import { AUTH_ENDPOINTS } from "../../api/endpoints/authEndpoints";

export const handleMicrosoftLogin = async (token: string, isTeacher: boolean) => {
  const endpoint = isTeacher
    ? AUTH_ENDPOINTS.MS_TEACHER
    : AUTH_ENDPOINTS.MS_STUDENT;

  const response  = await Axios.post(endpoint, { token });
  return response;
};
