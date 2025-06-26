import {  Eye, Search, UserCheck } from "lucide-react"
import { formatDate } from "../../utils/formateDate";
import { useNavigate } from "react-router-dom";
import type React from "react";
import Pagination from "../../common/ui/Pagination";
import type { StudentSubmissionProps, Submission } from "../../interface/student";

const StudentSubmissionTable: React.FC<StudentSubmissionProps> = ({ taskId,submissions, totalCount, loading, error, page, limit, searchTerm, setPage, setSearchTerm }) => {
  console.log(submissions);
  
    const navigate = useNavigate()
  
    const totalPages = Math.ceil(totalCount / limit);

  const handleNavigate=(submission:Submission)=>{
    
    navigate(`/teacher/view-answers/${submission.id}`,{state:{taskId,submittedStudent: submission }})
    
  }

  return (
    <div className="mt-8 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="p-8 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <UserCheck size={24} className="text-green-600" />
          Student Submissions
        </h2>
        
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
              <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
              <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted At</th>
              <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan={6} className="px-8 py-4 text-center text-gray-500">Loading...</td></tr>
            ) : submissions.length === 0 ? (
              <tr><td colSpan={6} className="px-8 py-4 text-center text-gray-500">No students found</td></tr>
            ) : (
              submissions.map((submission) => (
                <tr key={submission.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-8 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium">
                          {submission.name.split(' ').map(n => n[0]).join('')}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{submission.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-4 whitespace-nowrap text-sm text-gray-600">{submission.email}</td>
                  <td className="px-8 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {submission.class}
                    </span>
                  </td>
                  <td className="px-8 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      submission.status === 'Submitted' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-orange-100 text-orange-800'
                    }`}>
                      {submission.status}
                    </span>
                  </td>
                  <td className="px-8 py-4 whitespace-nowrap text-sm text-gray-600">
                    {submission.submissionDate ? formatDate(submission.submissionDate) : 'Not submitted'}
                  </td>
                  <td className="px-8 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                    onClick={() => handleNavigate(submission)}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                        submission.status === 'Submitted'
                          ? 'bg-blue-600 hover:bg-blue-700 text-white'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                      disabled={submission.status !== 'Submitted'}
                    >
                      <Eye size={16} />
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {error && <div className="py-4 px-8 text-red-600">{error}</div>}
      </div>

      {/* Pagination */}
     <Pagination
     currentPage={page}
     onPageChange={setPage}
     totalPages={totalPages}
     itemsPerPage={limit}
     />
    </div>
  )
}

export default StudentSubmissionTable