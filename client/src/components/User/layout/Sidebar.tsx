import React, { useState } from 'react';
import { Home, BookOpen, User, X, LogOut, Menu, Bell } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import useLogout from '../../../services/auth/useLogout';
import { clearStudent } from '../../../state/redux/slices/studentSlice';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../state/redux/store/store';
import { removeAccessTokenFromSession } from '../../../utils/tokenUtlis';

const Sidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const student = useSelector((state:RootState)=>state.studentAuth)

  const dispatch = useDispatch();
  const { logout } = useLogout();

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, path: "/" },
    { id: 'tasks', label: 'All Tasks', icon: BookOpen, path: "/all-tasks" },
    { id: 'profile', label: 'Profile', icon: User, path: "/profile" },
  ];

  const handleLogout = async () => {
    try {
      const res = await logout();
      if (res) {
        dispatch(clearStudent());
        removeAccessTokenFromSession()
        navigate("/signin");
        toast.success('Logged out successfully');
      } else {
        console.log("error", res?.message);
        toast.error('Error logging out');
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Error logging out');
    }
  };

  const handleNavClick = (path) => {
    navigate(path);
    setSidebarOpen(false);
  };


  return (
    <>
      {/* Mobile Header - Only visible on mobile */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-white shadow-sm border-b border-gray-200 h-16 flex items-center justify-between px-4">
        <button
          onClick={() => setSidebarOpen(true)}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        
        <h2 className="text-lg font-bold text-gray-900">IBACUS</h2>
        
        <div className="flex items-center space-x-3">
          <button className="relative text-gray-500 hover:text-gray-700">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">3</span>
          </button>
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-white">{student.name?.charAt(0).toUpperCase() || "😊"}</span>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform lg:translate-x-0 lg:static lg:inset-0`}>
        
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">IBACUS</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        {/* Navigation Menu */}
        <nav className="mt-6 px-3">
          {sidebarItems.map(item => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.path)}
                className={`w-full flex items-center px-3 py-3 text-left rounded-lg mb-2 transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* User Info Section */}
        <div className="absolute bottom-6 left-0 right-0 px-6">
          <div className="bg-gray-50 rounded-lg p-4 mb-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-white">{student.name?.charAt(0).toUpperCase() || "😊"}</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{student?.name}</p>
                <p className="text-xs text-gray-500">{student.class}</p>
              </div>
            </div>
          </div>
          
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-3 py-2 text-left rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
          >
            <LogOut className="w-4 h-4 mr-3" />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Sidebar;