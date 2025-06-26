import { LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import avatar from "../../../../public/images/avatar.png"; 
import type { RootState } from "../../../state/redux/store/store";
import useLogout from "../../../services/auth/useLogout";
import { removeAccessTokenFromSession } from "../../../utils/tokenUtlis";
import { useDispatch } from "react-redux";
import { clearTeacher } from "../../../state/redux/slices/teacherSlice";
import { clearStudent } from "../../../state/redux/slices/studentSlice";
import { toast } from "sonner";
import { menuItems } from "../../../constants/data";



const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch()

  const teacherData = useSelector((state: RootState) => state.teacherAuth);
  const isTeacher = location.pathname.includes("/teacher");


const {logout} = useLogout()
 

  const handleLogout = async() => {
    const res = await logout()
    if(res){
      removeAccessTokenFromSession()
      if(isTeacher){
        dispatch(clearTeacher())
        navigate('/teacher/signin')
      }else{
        dispatch(clearStudent())
        navigate('/')
      }
    }else{
      console.log("error")
      toast.error('Error logging out')
    }
  };
  const toggleSidebar = () => setIsOpen((prev) => !prev);

  return (
    <>
      {/*For mobile Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-xl shadow-lg border border-gray-200 hover:bg-gray-50"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-80 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        flex flex-col h-screen
      `}
      >
        {/* background decoration for sidebar */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16"></div>
          <div className="absolute top-20 right-0 w-24 h-24 bg-white rounded-full translate-x-12"></div>
          <div className="absolute bottom-20 left-0 w-20 h-20 bg-white rounded-full -translate-x-10"></div>
        </div>

        {/* Profile Section */}
        <div className="relative p-6 pb-8">
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 p-1 shadow-xl">
                <img
                  src={teacherData.avatarUrl || avatar}
                  alt={teacherData.name || ""}
                  className="w-full h-full rounded-full object-cover border-2 border-white"
                />
              </div>
            </div>
            <h2 className="text-white font-semibold text-lg mb-1 leading-tight">
              {teacherData.name}
            </h2>
            <p className="text-purple-200 text-sm opacity-90">{teacherData.email}</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="relative px-4 py-2 flex-1">
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group
                    ${isActive ? "bg-white/20 text-white shadow-lg" : "text-purple-100 hover:bg-white/10"}`
                  }
                  onClick={() => setIsOpen(false)}
                >
                  {({ isActive }) => (
                    <>
                      <div
                        className={`p-2 rounded-lg transition-all duration-200
                        ${isActive ? "bg-white/30 text-white" : "text-purple-200 group-hover:bg-white/20 group-hover:text-white"}`}
                      >
                        <item.icon size={20} />
                      </div>
                      <span className={`font-medium ${isActive ? "text-white" : "group-hover:text-white"}`}>
                        {item.label}
                      </span>
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout Section */}
        <div className="p-4 mt-auto">
          <button
            onClick={handleLogout}
            className="
              w-full flex items-center gap-4 px-4 py-3 rounded-xl
              text-red-100 hover:bg-red-500/20 hover:text-white
              transition-all duration-200 group border border-red-400/30
              hover:border-red-400/50 hover:shadow-lg
              cursor-pointer
            "
            style={{ zIndex: 100 }}
          >
            <div
              className="
                p-2 rounded-lg transition-all duration-200
                text-red-200 group-hover:bg-red-500/30 group-hover:text-white
              "
            >
              <LogOut size={20} />
            </div>
            <span className="font-medium">Logout</span>
          </button>
        </div>

      </div>
    </>
  );
};

export default Sidebar;
