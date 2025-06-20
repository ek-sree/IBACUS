import axios from "axios";
import { isTokenExpired } from "./tokenExpireCheck";
import { getAccessTokenFromSession, removeAccessTokenFromSession, saveAccessTokenToSession } from "./tokenUtlis";
import { REFRESH_ENDPOINTS } from "../api/endpoints/refreshEndpoints";
import { decodeJWT } from "./decodeJWT";


export const isAuthenticated = async (requiredRole?: string): Promise<boolean> => {
  const accessToken = getAccessTokenFromSession();

  if (accessToken && !isTokenExpired(accessToken)) {
     const decoded = decodeJWT(accessToken);
    if (requiredRole && decoded?.role !== requiredRole) return false;
    return true; 
  }

  try {
    const { data } = await axios.post(REFRESH_ENDPOINTS.REFRESH_TOKEN, {}, { withCredentials: true });
    const newAccessToken = data.accessToken;
    saveAccessTokenToSession(newAccessToken); 
    const decoded = decodeJWT(newAccessToken);
    if (requiredRole && decoded?.role !== requiredRole) return false;
    return true; 
  } catch (error) {
    console.error('Refresh token failed or expired:', error);
    removeAccessTokenFromSession();
    return false; 
  }
};
