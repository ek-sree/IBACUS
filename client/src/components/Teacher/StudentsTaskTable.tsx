import { Search, Filter, CheckCircle, XCircle, Users, RotateCcw } from "lucide-react";
import { useState, useMemo } from "react";

interface Student {
  name: string;
  email: string;
  completedTasks: number;
}

interface MockData {
  totalTasks: number;
  students: Student[];
  weeklyTrend: number[];
}

interface StudentsTaskTableProps {
  currentStudents: Student[];
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  mockData: MockData;
}

const StudentsTaskTable = ({
  currentStudents,
  currentPage,
  setCurrentPage,
  totalPages,
  mockData,
}: StudentsTaskTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");


  
  // Filter and search logic
  const filteredStudents = useMemo(() => {
    let filtered = currentStudents;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(student => {
        const isCompleted = student.completedTasks >= mockData.totalTasks / 2;
        return statusFilter === "completed" ? isCompleted : !isCompleted;
      });
    }

    return filtered;
  }, [currentStudents, searchTerm, statusFilter, mockData.totalTasks]);

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
  };

  const getStatusConfig = (completedTasks: number) => {
    const isCompleted = completedTasks >= mockData.totalTasks / 2;
    return isCompleted
      ? { text: "Completed", class: "bg-green-100 text-green-700 border-green-200" }
      : { text: "In Progress", class: "bg-yellow-100 text-yellow-700 border-yellow-200" };
  };

  const getCompletionPercentage = (completedTasks: number) => {
    return Math.round((completedTasks / mockData.totalTasks) * 100);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-100">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Students Overview</h2>
              <p className="text-gray-600 text-sm">
                Showing {filteredStudents.length} of {currentStudents.length} students
              </p>
            </div>
          </div>

          {/* Filters Section */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2.5 w-full sm:w-64 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
              />
            </div>

            {/* Status Filter */}
            <div className="flex gap-2">
              <button
                onClick={() => setStatusFilter("all")}
                className={`px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 flex items-center gap-2 ${
                  statusFilter === "all"
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Filter className="w-4 h-4" />
                All
              </button>
              
              <button
                onClick={() => setStatusFilter("completed")}
                className={`px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 flex items-center gap-2 ${
                  statusFilter === "completed"
                    ? "bg-green-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <CheckCircle className="w-4 h-4" />
                Completed
              </button>
              
              <button
                onClick={() => setStatusFilter("incomplete")}
                className={`px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 flex items-center gap-2 ${
                  statusFilter === "incomplete"
                    ? "bg-yellow-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <XCircle className="w-4 h-4" />
                In Progress
              </button>

              {/* Clear Filters */}
              {(searchTerm || statusFilter !== "all") && (
                <button
                  onClick={clearFilters}
                  className="px-3 py-2.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all duration-200 flex items-center gap-2"
                  title="Clear all filters"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Student
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Progress
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Tasks Completed
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student, index) => {
                const percentage = getCompletionPercentage(student.completedTasks);
                const status = getStatusConfig(student.completedTasks);
                
                return (
                  <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-4">
                          {student.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{student.name}</div>
                          <div className="text-sm text-gray-500">{student.email}</div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-700 min-w-[3rem]">
                          {percentage}%
                        </span>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 text-center">
                      <div className="text-lg font-semibold text-gray-900">
                        {student.completedTasks}
                        <span className="text-sm text-gray-500 font-normal">
                          /{mockData.totalTasks}
                        </span>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${status.class}`}>
                        {status.text}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                      <Search className="w-6 h-6 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium">No students found</p>
                      <p className="text-gray-400 text-sm">Try adjusting your search or filter criteria</p>
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredStudents.length > 0 && (
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {filteredStudents.length} of {currentStudents.length} students
            </div>
            <div className="flex gap-2">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                    currentPage === i + 1
                      ? "bg-blue-600 text-white shadow-lg"
                      : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentsTaskTable;