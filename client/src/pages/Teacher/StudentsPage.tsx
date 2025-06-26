import Sidebar from "../../components/Teacher/layout/Sidebar"
import User from "../../components/Teacher/Students"

const StudentsPage = () => {
 return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <div className="flex-1 overflow-auto pt-16 lg:pt-0">
          <User />
        </div>
      </div>
    </div>
  )
}

export default StudentsPage