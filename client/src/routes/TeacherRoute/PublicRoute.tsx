import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated } from '../../utils/authCheck';



export const PublicRoute: React.FC = () => {
    const [authStatus, setAuthStatus] = useState<boolean | null>(null);
  
    useEffect(() => {
      const checkUserAuth = async () => {
        try {
          const isAuth = await isAuthenticated("teacher"); 
          setAuthStatus(isAuth);
        } catch (error) {
          console.error('Error checking authentication:', error);
          setAuthStatus(false);
        }
      };
      checkUserAuth();
    }, []);
  
    if (authStatus === null) {
      return <div>Loading..</div>;
    }
  
    return !authStatus ? <Outlet /> : <Navigate to="/teacher/dashboard" replace />;
  };