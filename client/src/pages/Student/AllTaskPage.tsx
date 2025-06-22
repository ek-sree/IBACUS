import Sidebar from '../../components/User/layout/Sidebar'
import AllTask from '../../components/User/AllTask'

const AllTaskPage = () => {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <div className="flex">
        <Sidebar />
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <div className="lg:pt-0 pt-16">
          <AllTask />
        </div>
      </div>
    </div>
  )
}

export default AllTaskPage