import React from "react";
import {
  Calendar,
  BookOpen,
  Clock,
  CheckCircle,
} from "lucide-react";
import { formatDate } from "../../utils/formateDate";
import Pagination from "../../common/ui/Pagination";
import SmallLoader from "../../common/components/SmallLoader";
import type { CompletedTaskTableProps } from "../../interface/studentTask";



const CompletedTaskTable: React.FC<CompletedTaskTableProps> = ({
  tasks,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  error,
  loading,
  totalCount
}) => {


  // Pagination
 const totalPages = Math.ceil(totalCount / itemsPerPage);

  return (
    <div className="space-y-6">
      {/* Completed Tasks Table */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-5 text-left text-sm font-semibold text-gray-900">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
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
                  Marks
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
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Completed Date
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {tasks.map((task) => (
                <tr
                  key={task.id}
                  className="hover:bg-gradient-to-r hover:from-green-50/50 hover:to-emerald-50/50 transition-all duration-200 group"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full opacity-60 group-hover:opacity-100 transition-opacity"></div>
                      <div>
                        <p className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
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
                    <div className="flex flex-col items-center">
                      <span className="text-lg font-bold text-green-600">
                        {task?.TaskSubmission[0]?.grade || 0}/{task.maxMarks}
                      </span>
                      <span className="text-xs text-gray-500">
                        {Math.round(((task?.TaskSubmission[0]?.grade || 0) / task.maxMarks) * 100)}%
                      </span>
                    </div>
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
                    <div className="text-sm">
                      <p className="font-medium text-green-600">
                        {task?.TaskSubmission[0]?.createdAt ? formatDate(task?.TaskSubmission[0]?.createdAt) : 'N/A'}
                      </p>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {tasks.length === 0 && !error && !loading &&(
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-12 h-12 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No completed tasks found</h3>
              <p className="text-gray-500">Complete some tasks to see them here</p>
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
                                <div className="text-center py-16 flex items-center justify-center">
                                  <SmallLoader/>
                                  </div>

            )
          }
        </div>
      </div>

      {/* Pagination */}
     <Pagination
     currentPage={currentPage}
     onPageChange={setCurrentPage}
     totalPages={totalPages}
     itemsPerPage={itemsPerPage}
     />
    </div>
  );
};

export default CompletedTaskTable;