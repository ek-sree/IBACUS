import Sidebar from "../../components/Teacher/Sidebar"
import User from "../../components/Teacher/Students"

const StudentsPage = () => {
 return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Content wrapper with proper spacing for mobile menu button */}
        <div className="flex-1 overflow-auto pt-16 lg:pt-0">
          <User />
        </div>
      </div>
    </div>
  )
}

export default StudentsPage