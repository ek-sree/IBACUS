import { useState } from "react"
import AddTask from "./AddTask"
import { Plus } from "lucide-react"
import TaskListTable from "./TaskListTable"

const Task = () => {
    const [isAddTaskOpen, setIsAddTaskOpen] = useState<boolean>(false)

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-6">
                <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Task Management
          </h1>
          <p className="text-gray-600">Manage and track your tasks </p>
        </div>
                <button 
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
                    onClick={() => setIsAddTaskOpen(true)}
                >
                    <Plus className="h-5 w-5" />
                    Add Task
                </button>
            </div>
            
            {isAddTaskOpen && (
                <div className="fixed inset-0 bg-gray-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity duration-300">
                    <AddTask
                        isOpen={isAddTaskOpen}
                        onClose={() => setIsAddTaskOpen(false)}
                    />
                </div>
            )}
            
           <TaskListTable/>
        </div>
    )
}

export default Task