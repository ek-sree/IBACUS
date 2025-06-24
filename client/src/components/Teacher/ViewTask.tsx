import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  BookOpen, 
  FileText, 
  Paperclip, 
  Eye,
  ArrowLeft,
  Star,
  Download,
} from 'lucide-react';
import { formatDate } from '../../utils/formateDate';
import { handleDownload } from '../../utils/downloadDatas';
import { useState } from 'react';
import ViewImageModal from '../../common/modal/ViewImageModal';
import PdfViewerModal from '../../common/modal/PdfViewerModal';
import StudentSubmissionTable from './StudentSubmissionTable';
import useFetchStudentsByTaskId from '../../services/teacherManagment/useFetchStudentsByTaskId';
import useDebounce from '../../hooks/useDebounce';

const ViewTask = () => {

     const [isPreviewOpen, setIsPreviewOpen] = useState(false);
      const [imagePreviewUrl, setImagePreviewUrl] = useState("");
      const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
      const [pdfUrl, setPdfUrl] = useState(null);

  const { id } = useParams();

  const location = useLocation();
  const navigate = useNavigate();

  const taskData = location.state.task

  const [page,setPage] = useState<number>(1)
    const [limit,setLimit] = useState<number>(5);
    const [searchTerm,setSearchTerm] = useState<string>("");
    const debouncedSearchTerm = useDebounce(searchTerm)
const {data,totalCount,error,loading} = useFetchStudentsByTaskId(taskData.id || id,page,limit,debouncedSearchTerm);
const submissions = data;


const handlePdfPreview = (url) => {
    setPdfUrl(url);
    setIsPdfModalOpen(true);
  };

  const handlePreview = (url) => {
    setImagePreviewUrl(url);
    setIsPreviewOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 text-gray-600 hover:text-gray-800">
            <ArrowLeft size={20} />
            Back to Tasks
          </button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{taskData.title}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <BookOpen size={16} />
                {taskData.subject}
              </div>
              <div className="flex items-center gap-1">
                <Star size={16} />
                {taskData.maxMarks} marks
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Task Details Card */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <FileText size={24} className="text-blue-600" />
                Task Details
              </h2>
              
              <div className="space-y-6">
                {taskData.description &&(<div>
                  <h3 className="font-semibold text-gray-700 mb-2">Description</h3>
                  <p className="text-gray-600 leading-relaxed">{taskData.description}</p>
                </div>)}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                    <Calendar size={20} className="text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Assigned Date</p>
                      <p className="text-blue-600 font-semibold">{formatDate(taskData.assignedDate)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg">
                    <Clock size={20} className="text-red-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Due Date</p>
                      <p className="text-red-600 font-semibold">{formatDate(taskData.dueDate)}</p>
                    </div>
                  </div>
                </div>

                {/* Instructions */}
                {taskData.instruction &&(<div>
                  <h3 className="font-semibold text-gray-700 mb-3">Task Instructions</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <pre className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap font-sans">
                      {taskData.instructions}
                    </pre>
                  </div>
                </div>)}
              </div>
            </div>

            {/* Images Section */}
            {(taskData.attachments?.length > 0 || taskData.images?.length > 0) && (
                         <div>
                           <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                             <Paperclip className="w-5 h-5 text-indigo-600" />
                             Attachments
                           </h3>
                           <div className="space-y-4">
                             {/* PDFs */}
                             {taskData.attachments?.length > 0 && (
                               <div>
                                 <h4 className="font-medium text-gray-700 mb-3">Documents</h4>
                                 <div className="grid gap-3">
                                   {taskData.attachments.map((attachment, index) => (
                                     <div
                                       key={index}
                                       className="flex items-center justify-between p-4 bg-red-50 border border-red-100 rounded-xl"
                                     >
                                       <div className="flex items-center gap-3">
                                         <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                                           <FileText className="w-5 h-5 text-white" />
                                         </div>
                                         <span className="font-medium text-gray-800">{attachment.split("/").pop()}</span>
                                       </div>
                                       <div className="flex gap-2">
                                         <button
                                           className="p-2 text-gray-600 hover:text-red-600 hover:bg-white rounded-lg"
                                           onClick={() => handlePdfPreview(attachment)}
                                         >
                                           <Eye className="w-4 h-4" />
                                         </button>
                                         <button
                                           className="p-2 text-gray-600 hover:text-red-600 hover:bg-white rounded-lg"
                                           onClick={() => handleDownload(attachment)}
                                         >
                                           <Download className="w-4 h-4" />
                                         </button>
                                       </div>
                                     </div>
                                   ))}
                                 </div>
                               </div>
                             )}
           
                             {/* Images */}
                             {taskData.images?.length > 0 && (
                               <div>
                                 <h4 className="font-medium text-gray-700 mb-3">Images</h4>
                                 <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                   {taskData.images.map((imageUrl, index) => (
                                     <div
                                       key={index}
                                       className="relative rounded-xl overflow-hidden shadow-lg hover:shadow-xl"
                                     >
                                       <img
                                         src={imageUrl}
                                         alt={`image-${index}`}
                                         className="w-full h-40 object-cover hover:scale-105 transition-transform"
                                       />
                                       <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                                         <div className="flex gap-2">
                                           <button
                                             className="p-2 bg-white/90 text-gray-800 rounded-lg"
                                             onClick={() => handlePreview(imageUrl)}
                                           >
                                             <Eye className="w-4 h-4" />
                                           </button>
                                           <button
                                             className="p-2 bg-white/90 text-gray-800 rounded-lg"
                                             onClick={() => handleDownload(imageUrl)}
                                           >
                                             <Download className="w-4 h-4" />
                                           </button>
                                         </div>
                                       </div>
                                     </div>
                                   ))}
                                 </div>
                               </div>
                             )}
                           </div>
                         </div>
                       )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="font-bold text-gray-800 mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Students</span>
                  <span className="font-bold text-gray-800">{submissions.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Submitted</span>
                  <span className="font-bold text-green-600">{submissions.filter(s => s.status === 'Submitted').length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Pending</span>
                  <span className="font-bold text-orange-600">{submissions.filter(s => s.status !== 'Submitted').length}</span>
                </div>
              </div>
            </div>

            {/* Progress */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="font-bold text-gray-800 mb-4">Submission Progress</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium">{Math.round((submissions.filter(s => s.status === 'Submitted').length / submissions.length) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(submissions.filter(s => s.status === 'Submitted').length / submissions.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submissions Table */}
        <StudentSubmissionTable
         error={error}
         limit={limit}
         loading={loading}
         page={page}
         searchTerm={searchTerm}
         setLimit={setLimit}
         setPage={setPage}
         setSearchTerm={setSearchTerm}
         submissions={submissions}
         totalCount={totalCount}
         taskId={taskData.id || id}
         />
      </div>
{
        isPdfModalOpen &&(
            <PdfViewerModal
            fileUrl={pdfUrl!}
            isOpen={isPdfModalOpen}
            onClose={()=>setIsPdfModalOpen(false)}
            />
        )
      }
      {
        isPreviewOpen &&(
          <ViewImageModal
          imagePreviewUrl={imagePreviewUrl}
          isOpen={isPreviewOpen}
          onClose={()=>setIsPreviewOpen(false)}
          />
        )
      }
    </div>
  );
};

export default ViewTask;