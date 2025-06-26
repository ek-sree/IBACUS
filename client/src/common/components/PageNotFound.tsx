import { Home, Search, ArrowLeft, Frown, Star } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAccessTokenFromSession } from "../../utils/tokenUtlis";

export default function PageNotFound() {
    const location = useLocation();
    const navigate = useNavigate();
    
    const isTeacher = location.pathname.includes("/teacher");
    const isAuth = getAccessTokenFromSession();


  const handleGoHome = () => {
    if(!isAuth){
        navigate(isTeacher ? "/teacher/signin" : "/signin")
    }else{
        navigate(isTeacher ? "/teacher/dashboard" : "/")
    }
  };

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-pink-50 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="relative mb-8">
          <div className="text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 mb-4">
            404
          </div>

          <div className="absolute top-0 left-1/4 animate-float">
            <Star className="w-6 h-6 text-yellow-400 animate-pulse" />
          </div>
          <div className="absolute top-10 right-1/4 animate-float delay-300">
            <Search className="w-8 h-8 text-purple-400 animate-bounce" />
          </div>
          <div className="absolute bottom-0 left-1/3 animate-float delay-500">
            <Frown className="w-6 h-6 text-pink-400" />
          </div>
          
          <div className="absolute -top-4 -left-4 w-20 h-20 bg-purple-200 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-pink-200 rounded-full opacity-30 animate-pulse delay-300"></div>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
              Oops! Page Not Found
            </h1>
            <p className="text-gray-600 text-lg md:text-xl max-w-md mx-auto">
              The page you're looking for seems to have wandered off into the digital void.
            </p>
            <p className="text-gray-500 text-sm md:text-base">
              Don't worry, even the best explorers sometimes take a wrong turn!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
            <button
              onClick={handleGoHome}
              className="group flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <Home className="w-5 h-5 group-hover:animate-bounce" />
              <span>{isAuth ? 'Go Home' : 'Sign In'}</span>
            </button>
            
            <button
              onClick={handleGoBack}
              className="group flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-full font-semibold border-2 border-gray-200 hover:border-gray-300 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
            >
              <ArrowLeft className="w-5 h-5 group-hover:animate-pulse" />
              <span>Go Back</span>
            </button>
          </div>

          <div className="mt-12 p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              What can you do?
            </h3>
            <div className="text-sm text-gray-600 space-y-2">
              <p>• Check the URL for typos</p>
              <p>• Return to the homepage</p>
              <p>• Use the search function</p>
              <p>• Contact support if you think this is an error</p>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}