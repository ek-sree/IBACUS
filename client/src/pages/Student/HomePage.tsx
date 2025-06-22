import Home from "../../components/User/Home"
import Sidebar from "../../components/User/layout/Sidebar"

const HomePage = () => {
  return (
    <div className="flex h-screen bg-gray-50">
        <Sidebar/>
        <div className="flex-1">
            <Home/>
        </div>
    </div>
  )
}

export default HomePage