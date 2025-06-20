import axios from 'axios';
import { REFRESH_ENDPOINTS } from '../endpoints/refreshEndpoints';
import { isTokenExpired } from '../../utils/tokenExpireCheck';
import { getAccessTokenFromSession, removeAccessTokenFromSession, saveAccessTokenToSession } from '../../utils/tokenUtlis';
import { useNavigate } from 'react-router-dom';

const Axios = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json', 
  },
});



Axios.interceptors.request.use(async (config) => {
  const accessToken = getAccessTokenFromSession(); 
  if (accessToken) {
    if (isTokenExpired(accessToken)) {
      try {
        const { data } = await axios.post(REFRESH_ENDPOINTS.REFRESH_TOKEN, {}, { withCredentials: true });
        const newAccessToken = data.accessToken;
        saveAccessTokenToSession(newAccessToken);
        config.headers['Authorization'] = `Bearer ${newAccessToken}`;
      } catch (error) {
        console.error('Error refreshing token', error);
        removeAccessTokenFromSession();
        throw error;
      }
    } else {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
  }
  return config;
});




Axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { data } = await axios.post(REFRESH_ENDPOINTS.REFRESH_TOKEN, {}, { withCredentials: true });
        const newAccessToken = data.accessToken;

        saveAccessTokenToSession(newAccessToken);

        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return Axios(originalRequest);
      } catch (refreshError) {
        console.error('Refresh token failed', refreshError);
        const navigate = useNavigate();
        navigate('/login');
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default Axios;
