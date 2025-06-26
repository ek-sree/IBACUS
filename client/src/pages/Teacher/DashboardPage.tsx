import Dashboard from "../../components/Teacher/Dashboard";
import Sidebar from "../../components/Teacher/layout/Sidebar";

const DashboardPage = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Content wrapper with proper spacing for mobile menu button */}
        <div className="flex-1 overflow-auto pt-16 lg:pt-0">
          <Dashboard />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;