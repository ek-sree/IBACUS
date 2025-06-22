import { useEffect, useState } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  Calendar,
  BookOpen,
  Clock,
  SortAsc,
  CheckSquare,
} from "lucide-react";
import useFetchTask from "../../services/TaskManagment/useFetchTask";
import { useSelector } from "react-redux";
import type { RootState } from "../../state/redux/store/store";
import useFetchTaskByClass from "../../services/studentManagments/useFetchTaskByClass";
import useFetchTaskByStudent from "../../services/studentManagments/useFetchTaskByStudent";

const sortOptions = [
  { value: "title", label: "Title" },
  { value: "subject", label: "Subject" },
  { value: "assignedDate", label: "Assigned Date" },
  { value: "dueDate", label: "Due Date" },
];

const AllTask = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [sortBy, setSortBy] = useState("");
  const [tasksList, setTasksList] = useState([]);


  const studentId = useSelector((state:RootState)=>state.studentAuth?.id) || undefined
  const className = useSelector((state:RootState)=>state.studentAuth?.class) || undefined

  
  const {data:tasks,error,loading} = useFetchTaskByStudent(studentId!)  
  const {data:classData,error:isError,loading:isLoading} = useFetchTaskByClass(className!)

  console.log("TASK",tasks);
  console.log("CLASSDATA",classData)
  
  const totalCount = tasksList.length;
useEffect(() => {
  if (tasks && classData) {
    // Merge arrays
    const allTasks = [...tasks, ...classData];

    // Remove duplicates by id using a Map
    const uniqueTasks = Array.from(
      new Map(allTasks.map((task) => [task.id, task])).values()
    );

    setTasksList(uniqueTasks);
  } else if (tasks) {
    setTasksList(tasks);
  } else if (classData) {
    setTasksList(classData);
  } else {
    setTasksList([]);
  }
}, [tasks, classData]);
console.log("TASKS",tasksList);


  // Format date function
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  

  // Pagination
  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTasks = tasksList

  const getSubjectColor = (subject) => {
    const colors = {
      Mathematics: "bg-gradient-to-r from-blue-500 to-blue-600 text-white",
      English: "bg-gradient-to-r from-green-500 to-green-600 text-white",
      Physics: "bg-gradient-to-r from-purple-500 to-purple-600 text-white",
      History: "bg-gradient-to-r from-orange-500 to-orange-600 text-white",
      Chemistry: "bg-gradient-to-r from-red-500 to-red-600 text-white",
    };
    return colors[subject] || "bg-gradient-to-r from-gray-500 to-gray-600 text-white";
  };






  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-lg mb-4">
            <CheckSquare className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            All Tasks
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Track all your assignments and tasks
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                <p className="text-3xl font-bold text-gray-900">{totalCount}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <CheckSquare className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Due Soon</p>
                <p className="text-3xl font-bold text-orange-600">
                  {/* {filteredTasks.filter(task => {
                    {task.dueDate}
                    return days.color === "text-yellow-600" || days.color === "text-orange-600";
                  }).length} */}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Subjects</p>
                <p className="text-3xl font-bold text-green-600">
                  {new Set(tasks.map(task => task.subject)).size}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Marks</p>
                <p className="text-3xl font-bold text-purple-600">
                  {tasks.reduce((sum, task) => sum + task.maxMarks, 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Controls */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search tasks by title or subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white/50 border border-gray-200 rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">Sort by...</option>
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <SortAsc className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Tasks Table */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-5 text-left text-sm font-semibold text-gray-900">
                    <div className="flex items-center gap-2">
                      <CheckSquare className="w-4 h-4" />
                      Task Title
                    </div>
                  </th>
                  <th className="px-6 py-5 text-left text-sm font-semibold text-gray-900">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      Subject
                    </div>
                  </th>
                  <th className="px-6 py-5 text-center text-sm font-semibold text-gray-900">
                    Max Marks
                  </th>
                  <th className="px-6 py-5 text-left text-sm font-semibold text-gray-900">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Assigned Date
                    </div>
                  </th>
                  <th className="px-6 py-5 text-left text-sm font-semibold text-gray-900">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Due Date
                    </div>
                  </th>
                  <th className="px-6 py-5 text-center text-sm font-semibold text-gray-900">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedTasks.map((task) => {

                  return (
                    <tr
                      key={task.id}
                      className="hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-purple-50/50 transition-all duration-200 group"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full opacity-60 group-hover:opacity-100 transition-opacity"></div>
                          <div>
                            <p className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                              {task.title}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${getSubjectColor(task.subject)}`}>
                          {task.subject}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span className="text-lg font-bold text-gray-900">
                          {task.maxMarks}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-sm">
                          <p className="font-medium text-gray-900">{formatDate(task.assignedDate)}</p>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-sm">
                          <p className="font-medium text-gray-900">{formatDate(task.dueDate)}</p>
                          {/* <p className={`text-xs font-medium`}>
                            {dueStatus.text}
                          </p> */}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <button className="inline-flex items-center justify-center w-10 h-10 text-indigo-600 hover:text-white hover:bg-indigo-600 border border-indigo-200 hover:border-indigo-600 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md group">
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {paginatedTasks.length === 0 && (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckSquare className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No tasks found</h3>
                <p className="text-gray-500">Try adjusting your search criteria or add some tasks</p>
              </div>
            )}
          </div>
        </div>

        {/* Pagination */}
        {totalPages >= 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, tasks.length)} of {tasks.length} tasks
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </button>

              <div className="flex space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
                      currentPage === page
                        ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg transform scale-105"
                        : "text-gray-700 bg-white border border-gray-300 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-300 shadow-sm"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllTask;