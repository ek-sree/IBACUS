import React, { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, Eye, Edit2, Trash2, Calendar, Filter, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

const TaskListTable = () => {
  // Sample data - replace with your actual data
  const [tasks] = useState([
    { id: 1, title: "Complete React Project", subject: "Web Development", mark: 85, assignedDate: "2024-01-15", dueDate: "2024-02-15" },
    { id: 2, title: "Database Design", subject: "Database Management", mark: 92, assignedDate: "2024-01-10", dueDate: "2024-02-10" },
    { id: 3, title: "UI/UX Wireframes", subject: "Design", mark: 78, assignedDate: "2024-01-20", dueDate: "2024-02-20" },
    { id: 4, title: "API Integration", subject: "Backend Development", mark: 88, assignedDate: "2024-01-12", dueDate: "2024-02-12" },
    { id: 5, title: "Testing & QA", subject: "Quality Assurance", mark: 95, assignedDate: "2024-01-18", dueDate: "2024-02-18" },
    { id: 6, title: "Mobile Responsive", subject: "Frontend", mark: 82, assignedDate: "2024-01-22", dueDate: "2024-02-22" },
    { id: 7, title: "Security Implementation", subject: "Cybersecurity", mark: 90, assignedDate: "2024-01-14", dueDate: "2024-02-14" },
    { id: 8, title: "Performance Optimization", subject: "System Performance", mark: 87, assignedDate: "2024-01-16", dueDate: "2024-02-16" },
    { id: 9, title: "Documentation", subject: "Technical Writing", mark: 79, assignedDate: "2024-01-25", dueDate: "2024-02-25" },
    { id: 10, title: "Code Review", subject: "Development", mark: 93, assignedDate: "2024-01-08", dueDate: "2024-02-08" }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Filtering and sorting logic
  const filteredAndSortedTasks = useMemo(() => {
    let filtered = tasks.filter(task =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (sortConfig.key === 'assignedDate' || sortConfig.key === 'dueDate') {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        }

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [tasks, searchTerm, sortConfig]);

  // Pagination logic
  const totalPages = Math.ceil(filteredAndSortedTasks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentTasks = filteredAndSortedTasks.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <ArrowUpDown className="w-4 h-4 opacity-50" />;
    return sortConfig.direction === 'asc' 
      ? <ArrowUp className="w-4 h-4 text-blue-500" /> 
      : <ArrowDown className="w-4 h-4 text-blue-500" />;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getMarkColor = (mark) => {
    if (mark >= 90) return 'text-green-600 bg-green-50';
    if (mark >= 80) return 'text-blue-600 bg-blue-50';
    if (mark >= 70) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const generatePageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, start + maxVisible - 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        

        {/* Controls */}
        <div className=" rounded-2xl shadow-xl border border-gray-100 p-6 mb-6 backdrop-blur-sm bg-white/90">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by title or subject..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/50"
              />
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Filter className="w-4 h-4" />
              <span>Sort by columns to filter data</span>
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className=" rounded-2xl shadow-xl border border-gray-100 overflow-hidden backdrop-blur-sm bg-white/90">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    <button
                      onClick={() => handleSort('title')}
                      className="flex items-center gap-2 hover:text-blue-600 transition-colors duration-200"
                    >
                      Title {getSortIcon('title')}
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    <button
                      onClick={() => handleSort('subject')}
                      className="flex items-center gap-2 hover:text-blue-600 transition-colors duration-200"
                    >
                      Subject {getSortIcon('subject')}
                    </button>
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                    <button
                      onClick={() => handleSort('mark')}
                      className="flex items-center gap-2 hover:text-blue-600 transition-colors duration-200 mx-auto"
                    >
                      Mark {getSortIcon('mark')}
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    <button
                      onClick={() => handleSort('assignedDate')}
                      className="flex items-center gap-2 hover:text-blue-600 transition-colors duration-200"
                    >
                      <Calendar className="w-4 h-4" />
                      Assigned {getSortIcon('assignedDate')}
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    <button
                      onClick={() => handleSort('dueDate')}
                      className="flex items-center gap-2 hover:text-blue-600 transition-colors duration-200"
                    >
                      <Calendar className="w-4 h-4" />
                      Due Date {getSortIcon('dueDate')}
                    </button>
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentTasks.map((task, index) => (
                  <tr 
                    key={task.id} 
                    className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 transition-all duration-200 group"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                        {task.title}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        {task.subject}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${getMarkColor(task.mark)}`}>
                        {task.mark}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {formatDate(task.assignedDate)}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {formatDate(task.dueDate)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center space-x-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-all duration-200 hover:scale-110">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-all duration-200 hover:scale-110">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all duration-200 hover:scale-110">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredAndSortedTasks.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-2">No tasks found</div>
              <div className="text-gray-500 text-sm">Try adjusting your search criteria</div>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredAndSortedTasks.length)} of {filteredAndSortedTasks.length} tasks
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </button>

              <div className="flex space-x-1">
                {generatePageNumbers().map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      currentPage === page
                        ? 'bg-blue-600 text-white shadow-lg scale-105'
                        : 'text-gray-700 bg-white border border-gray-300 hover:bg-blue-50 hover:text-blue-600'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
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

export default TaskListTable;