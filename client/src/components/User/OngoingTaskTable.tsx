import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Calendar,
  BookOpen,
  Clock,
  CheckSquare,
  AlertCircle,
  Hourglass,
  Loader,
} from "lucide-react";
import { formatDate } from "../../utils/formateDate";
import { useNavigate } from "react-router-dom";

interface Task {
  id: string;
  title: string;
  subject: string;
  maxMarks: number;
  assignedDate: string;
  dueDate: string;
  isCompleted: boolean;
}

interface NotCompletedTaskProps {
  tasks: Task[];
  currentPage: number;
  setCurrentPage: (page: number) => void;
  itemsPerPage: number;
  error:string;
  loading:boolean
}

const OngoingTaskTable: React.FC<NotCompletedTaskProps> = ({
  tasks,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  error,
  loading,
totalCount
}) => {
  const navigate = useNavigate();

  // Filter only not completed tasks
  const notCompletedTasks = tasks.filter(task => !task.isCompleted);

  // Function to get due status
  const getDueStatus = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return {
        text: `Overdue by ${Math.abs(diffDays)} day(s)`,
        color: "text-red-600",
        bgColor: "bg-red-100",
        icon: AlertCircle,
      };
    } else if (diffDays === 0) {
      return {
        text: "Due today",
        color: "text-orange-600",
        bgColor: "bg-orange-100",
        icon: Clock,
      };
    } else if (diffDays <= 3) {
      return {
        text: `Due in ${diffDays} day(s)`,
        color: "text-yellow-600",
        bgColor: "bg-yellow-100",
        icon: Hourglass,
      };
    } else {
      return {
        text: `Due in ${diffDays} day(s)`,
        color: "text-blue-600",
        bgColor: "bg-blue-100",
        icon: Calendar,
      };
    }
  };

  // Pagination
  const totalPages = Math.ceil(totalCount / itemsPerPage);
 const startIndex = (currentPage - 1) * itemsPerPage;


  return (
    <div className="space-y-6">
      {/* Not Completed Tasks Table */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-orange-50 to-red-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-5 text-left text-sm font-semibold text-gray-900">
                  <div className="flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-orange-600" />
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
                <th className="px-6 py-5 text-left text-sm font-semibold text-gray-900">
                  Status
                </th>
                <th className="px-6 py-5 text-center text-sm font-semibold text-gray-900">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {tasks.map((task) => {
                const dueStatus = getDueStatus(task.dueDate);
                const StatusIcon = dueStatus.icon;

                return (
                  <tr
                    key={task.id}
                    className="hover:bg-gradient-to-r hover:from-orange-50/50 hover:to-red-50/50 transition-all duration-200 group"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full opacity-60 group-hover:opacity-100 transition-opacity"></div>
                        <div>
                          <p className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                            {task.title}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold shadow-sm bg-gradient-to-r from-gray-500 to-gray-700 text-white">
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
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${dueStatus.bgColor} ${dueStatus.color}`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {dueStatus.text}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <button 
                        onClick={() => navigate(`/view-and-answer-task/${task.id}` ,{ 
  state: { task } 
})} 
                        className="inline-flex items-center justify-center w-10 h-10 text-orange-600 hover:text-white hover:bg-orange-600 border border-orange-200 hover:border-orange-600 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md group"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {tasks.length === 0 && !error && !loading &&(
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckSquare className="w-12 h-12 text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No pending tasks found</h3>
              <p className="text-gray-500">Great! All tasks are completed</p>
            </div>
          )}
          {
            error && !loading &&(
                <div className="text-center py-16">
                   
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Error Occure</h3>
              <p className="text-gray-500">An Error occured try later</p>
                </div>
            )
          }
          {
            loading &&(
                <div className="text-center py-16">
                    <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Loader className="w-12 h-12 text-gray-900 animate-spin" />
              </div>
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">Loading..</h3>
                    <p className="text-gray-500">Loading data please wait...</p>
                </div>
            )
          }
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
          <div className="text-sm text-gray-600">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, notCompletedTasks.length)} of {notCompletedTasks.length} pending tasks
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
                      ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg transform scale-105"
                      : "text-gray-700 bg-white border border-gray-300 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-300 shadow-sm"
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
  );
};

export default OngoingTaskTable;