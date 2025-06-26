import { AlertTriangle, RefreshCw, Home, WifiOff, Zap, X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAccessTokenFromSession } from "../../utils/tokenUtlis";

export default function ErrorPage() {
     const location = useLocation();
    const isTeacher = location.pathname.includes("/teacher");
    const navigate = useNavigate();
    
    const isAuth = getAccessTokenFromSession();
  const handleTryAgain = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
   if(!isAuth){
        navigate(isTeacher ? "/teacher/signin" : "/signin")
    }else{
       navigate(isTeacher?"/teacher/dashboard":"/")
    }
  };
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="relative mb-8">
          <div className="relative mx-auto w-32 h-32 md:w-40 md:h-40 mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-orange-400 rounded-full animate-pulse opacity-20"></div>
            <div className="relative w-full h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center shadow-2xl">
              <AlertTriangle className="w-16 h-16 md:w-20 md:h-20 text-white animate-bounce" />
            </div>
          </div>
          
          <div className="absolute top-0 left-1/4 animate-float">
            <X className="w-5 h-5 text-red-400 animate-spin" />
          </div>
          <div className="absolute top-8 right-1/4 animate-float delay-300">
            <WifiOff className="w-6 h-6 text-orange-400 animate-pulse" />
          </div>
          <div className="absolute bottom-2 left-1/3 animate-float delay-500">
            <Zap className="w-5 h-5 text-yellow-500 animate-bounce" />
          </div>
          
          <div className="absolute -top-8 -right-8 w-24 h-24 bg-red-200 rounded-full opacity-10 animate-pulse"></div>
          <div className="absolute -bottom-8 -left-8 w-20 h-20 bg-orange-200 rounded-full opacity-15 animate-pulse delay-700"></div>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600">
              Sorry!
            </h1>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              Something Went Wrong
            </h2>
            <p className="text-gray-600 text-lg md:text-xl max-w-md mx-auto leading-relaxed">
              We encountered an unexpected error. Don't worry, our team has been notified and we're working to fix it.
            </p>
            <p className="text-gray-500 text-sm md:text-base">
              Please try again in a few moments.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
            <button
              onClick={handleTryAgain}
              className="group flex items-center gap-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl min-w-[180px]"
            >
              <RefreshCw className="w-5 h-5 group-hover:animate-spin" />
              <span>Try Again</span>
            </button>
            
            <button
              onClick={handleGoHome}
              className="group flex items-center gap-3 bg-white hover:bg-gray-50 text-gray-700 px-8 py-4 rounded-full font-semibold border-2 border-gray-200 hover:border-gray-300 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg min-w-[180px]"
            >
              <Home className="w-5 h-5 group-hover:animate-bounce" />
              <span>Go Home</span>
            </button>
          </div>

          <div className="mt-12 p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/30 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              What happened?
            </h3>
            <div className="text-sm text-gray-600 space-y-3 text-left max-w-lg mx-auto">
              <p>• A temporary server issue occurred</p>
              <p>• Your internet connection might be unstable</p>
              <p>• The service might be under maintenance</p>
              <p>• If the problem persists, please contact our support team</p>
            </div>
            
            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
              <span>Monitoring system status...</span>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(5deg); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}