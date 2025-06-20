import Axios from "../../api/axios/axios";
import { AUTH_ENDPOINTS } from "../../api/endpoints/authEndpoints";

const useLogout = () => {
    
    const logout = async()=>{
        try {
            const response = await Axios.post(`${AUTH_ENDPOINTS.LOGOUT}`)
            if(response.status==204){
                return true
            }
            else{
                console.error("Error occured while logging out.",response.data.message)
                return false
            }
        } catch (error:any) {
            console.error("Error occured while logging out. Please try again later!")
        }
    }
  return {logout};
}

export default useLogout;