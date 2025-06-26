import { useLocation, useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { PublicClientApplication } from "@azure/msal-browser";
import { useState } from "react";
import { saveAccessTokenToSession } from "../../utils/tokenUtlis";
import { useDispatch } from "react-redux";
import { setTeacher } from "../../state/redux/slices/teacherSlice";
import { setStudent } from "../../state/redux/slices/studentSlice";
import useGoogleSignin from "../../services/auth/useGoogleLogin";
import useMicrosoftLogin from "../../services/auth/useMicrosoftLogin";
import DotLoading from "../../common/components/DotLoading";

const msalConfig = {
  auth: {
    clientId: import.meta.env.VITE_MS_CLIENT_ID,
    authority: "https://login.microsoftonline.com/common",
    redirectUri: "http://localhost:5173",
  },
};
const msalInstance = new PublicClientApplication(msalConfig);

const Signin = () => {
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const isTeacher = location.pathname.includes("/teacher");
  const role = isTeacher ? "TEACHER" : "STUDENT";

  const {error:googleLoginError,googleSignin,loading:loadingGoogle} = useGoogleSignin()
  const {error:msLoginError,loading:loadingMS,loginWithMicrosoft} = useMicrosoftLogin()

  const dispatch = useDispatch();

  // GOOGLE LOGIN
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onGoogleSuccess = async (res: { code: any; }) => {
    const { code } = res;
    try {
      const data = await googleSignin(code, role);

      if (data) {
        saveAccessTokenToSession(data.accessToken);
        if (isTeacher) {
          dispatch(
            setTeacher({
              id: data.data.id,
              name: data.data.name,
              email: data.data.email,
              avatarUrl: data.data.avatar,
            })
          );
        } else {
          dispatch(
            setStudent({
              id: data.data.id,
              name: data.data.name,
              class:data.data.class,
              email: data.data.email,
            })
          );
        }
        navigate(isTeacher ? "/teacher/dashboard" : "/");
      } else {
        setError(googleLoginError||"Invalid credentials");
      } 
    } catch (err) {
      setError("Google login failed");
      console.error("Login error", err);
    } 
  };

  const googleLogin = useGoogleLogin({
    flow: "auth-code",
    onSuccess: onGoogleSuccess,
  });

  // MICROSOFT LOGIN
  const handleMsalLogin = async () => {
    try {
      await msalInstance.initialize();
      const loginResponse = await msalInstance.loginPopup({
        scopes: ["openid", "profile", "email"],
      });
      const idToken = loginResponse.idToken;

      const data = await loginWithMicrosoft(idToken,role)
if(data){

     
      saveAccessTokenToSession(data.data.accessToken);
      if (isTeacher) {
        dispatch(
          setTeacher({
            id: data.data.id,
            name: data.data.name,
            email: data.data.email,
            avatarUrl: data.data.avatar,
          })
        );
      } else {
        dispatch(
          setStudent({
            id: data.data.id,
            name: data.data.name,
            class:data.data.class,
            email: data.data.email,
          })
        );
      }
      navigate(isTeacher ? "/teacher/dashboard" : "/");
    }else{
      setError(msLoginError||"Invalid credentials");
    }
    } catch (err) {
      console.error("Microsoft login failed", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-3xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-center">
          <h1 className="text-3xl font-bold text-white">
            {isTeacher ? "Teacher Portal" : "Student Portal"}
          </h1>
          <p className="text-blue-100 mt-2">
            Sign in to access your {isTeacher ? "teaching" : "learning"}{" "}
            resources
          </p>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="flex flex-col space-y-4">
            {/* Google Button */}
            <button
              disabled={loadingGoogle || loadingMS}
              onClick={() => googleLogin()}
              className="cursor-pointer flex items-center justify-center space-x-3 bg-white border border-gray-300 rounded-lg px-6 py-3 text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path
                  d="M21.8055 10.0415H21V10H12V14H17.6515C16.827 16.3285 14.6115 18 12 18C8.6865 18 6 15.3135 6 12C6 8.6865 8.6865 6 12 6C13.5295 6 14.921 6.577 15.9805 7.5195L18.809 4.691C17.023 3.0265 14.634 2 12 2C6.4775 2 2 6.4775 2 12C2 17.5225 6.4775 22 12 22C17.5225 22 22 17.5225 22 12C22 11.3295 21.931 10.675 21.8055 10.0415Z"
                  fill="#FFC107"
                />
                <path
                  d="M3.15302 7.3455L6.43852 9.755C7.32752 7.554 9.48052 6 12 6C13.5295 6 14.921 6.577 15.9805 7.5195L18.809 4.691C17.023 3.0265 14.634 2 12 2C8.15902 2 4.82802 4.1685 3.15302 7.3455Z"
                  fill="#FF3D00"
                />
                <path
                  d="M12 22C14.583 22 16.93 21.0115 18.7045 19.404L15.6095 16.785C14.6055 17.5455 13.3575 18 12 18C9.39902 18 7.19052 16.3415 6.35852 14.027L3.09752 16.5395C4.75252 19.778 8.11352 22 12 22Z"
                  fill="#4CAF50"
                />
                <path
                  d="M21.8055 10.0415H21V10H12V14H17.6515C17.2555 15.1185 16.536 16.083 15.608 16.7855L15.6095 16.7845L18.7045 19.4035C18.4855 19.6025 22 17 22 12C22 11.3295 21.931 10.675 21.8055 10.0415Z"
                  fill="#1976D2"
                />
              </svg>
              {loadingGoogle ? (
                <DotLoading/>
              ) : (
                <span>Continue with Google</span>
              )}
            </button>

            {/* Microsoft Button */}
            <button
              onClick={handleMsalLogin}
              disabled={loadingGoogle || loadingMS}
              className="cursor-pointer flex items-center justify-center space-x-3 bg-white border border-gray-300 rounded-lg px-6 py-3 text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <svg className="w-6 h-6" viewBox="0 0 23 23">
                <path d="M1 1H10.5V10.5H1V1Z" fill="#F25022" />
                <path d="M12.5 1H22V10.5H12.5V1Z" fill="#7FBA00" />
                <path d="M1 12.5H10.5V22H1V12.5Z" fill="#00A4EF" />
                <path d="M12.5 12.5H22V22H12.5V12.5Z" fill="#FFB900" />
              </svg>
              {loadingMS ? (
               <DotLoading/>
              ) : (
                <span>Continue with Microsoft</span>
              )}
            </button>
          </div>
          <div className="text-center mt-4">
            {error && <p className="text-red-500">{error}</p>}
          </div>
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-gray-500 text-sm">
              By signing in, you agree to our{" "}
              <a href="#" className="text-blue-600 hover:underline">
                Terms
              </a>{" "}
              and{" "}
              <a href="#" className="text-blue-600 hover:underline">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-4 text-center">
          <p className="text-gray-500 text-sm">
            IBACUS platform © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signin;
