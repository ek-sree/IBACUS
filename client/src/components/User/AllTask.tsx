import { useEffect, useState } from "react";
import {
  Search,
  CheckSquare,
  SortAsc,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "../../state/redux/store/store";
import { countDueSoon } from "../../utils/calculateDueSoon";
import CompletedTaskTable from "./CompletedTaskTable";
import OngoingTaskTable from "./OngoingTaskTable";
import useFetchTaskByStudent from "../../services/StudentManagment/useFetchStudentTask";

const sortOptions = [
  { value: "assignedDateAsc", label: "Assign Date asc - desc" },
  { value: "assignedDateDesc", label: "Assigned Date desc - asc" },
  { value: "dueDateAsc", label: "Due Date asc - desc" },
  { value: "dueDateDesc", label: "Due Date desc - asc" },
];

const AllTask = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(1);
  const [sortBy, setSortBy] = useState("");
  const [activeTab, setActiveTab] = useState<'pending' | 'completed'>('pending');

  const studentId = useSelector((state: RootState) => state.studentAuth?.id) || undefined;

  const { tasks,totalCount,completedCount,dueSoonCount,pendingCount,totalTaskCount,error: isError, loading: isLoading } = useFetchTaskByStudent(studentId!,searchTerm,sortBy,activeTab,currentPage,itemsPerPage);



 


  // Reset current page when switching tabs
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

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
                <p className="text-3xl font-bold text-gray-900">{totalTaskCount}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <CheckSquare className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Tasks</p>
                <p className="text-3xl font-bold text-orange-600">
                  {pendingCount}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed Tasks</p>
                <p className="text-3xl font-bold text-green-600">
                  {completedCount}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Due Soon</p>
                <p className="text-3xl font-bold text-red-600">
                  {dueSoonCount}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-red-600" />
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
                onChange={(e) => {setSearchTerm(e.target.value);setCurrentPage(1)}}
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

        {/* Tab Toggle */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-2">
          <div className="flex items-center justify-center">
            <div className="flex bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setActiveTab('pending')}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === 'pending'
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg transform scale-105'
                    : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'
                }`}
              >
                <AlertCircle className="w-4 h-4" />
                Pending Tasks
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                  activeTab === 'pending' ? 'bg-white/20 text-white' : 'bg-orange-100 text-orange-600'
                }`}>
                  {pendingCount}
                </span>
              </button>
              <button
                onClick={() => setActiveTab('completed')}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === 'completed'
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg transform scale-105'
                    : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                }`}
              >
                <CheckCircle className="w-4 h-4" />
                Completed Tasks
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                  activeTab === 'completed' ? 'bg-white/20 text-white' : 'bg-green-100 text-green-600'
                }`}>
                  {completedCount}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Task Tables */}
        {activeTab === 'pending' ? (
          <OngoingTaskTable
            tasks={tasks}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            itemsPerPage={itemsPerPage}
            loading={isLoading}
            error={isError}
            totalCount={totalCount}
          />
        ) : (
          <CompletedTaskTable
            tasks={tasks}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            itemsPerPage={itemsPerPage}
            error={isError}
            loading={isLoading}
            totalCount={totalCount}
          />
        )}
      </div>
    </div>
  );
};

export default AllTask;