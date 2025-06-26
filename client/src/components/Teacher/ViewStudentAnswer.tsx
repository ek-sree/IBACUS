import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Mail,
  GraduationCap,
  FileText,
  Image,
  Download,
  Clock,
  Eye,
  Star,
  Award,
} from "lucide-react";
import useFetchStudentAnswer from "../../services/TeacherManagment/useFetchStudentAnswer";
import { useState } from "react";
import { handleDownload } from "../../utils/downloadDatas";
import PdfViewerModal from "../../common/modal/PdfViewerModal";
import ViewImageModal from "../../common/modal/ViewImageModal";
import { formatDate } from "../../utils/formateDate";
import GradeForSubmissionModal from "./GradeForSubmissionModal";
import ErrorPage from "../../common/components/ErrorPage";
import BigLoader from "../../common/components/BigLoader";


const ViewStudentAnswer = () => {
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>("");
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isGradeModal,setIsModalGrade] = useState<boolean>(false);

  const { id } = useParams();

  const navigate = useNavigate();
  const location = useLocation();

  const taskId = location?.state.taskId || "";
  const submittedStudent = location?.state.submittedStudent || "";

  if (!id || !taskId || !submittedStudent) {
    navigate(-1);
  }
  const { studentAnswers, error, loading } = useFetchStudentAnswer(taskId, id!);

  console.log("ANSWERDATAA", studentAnswers);
  console.log("sub", submittedStudent);

  const handlePdfPreview = (url:string) => {
    setPdfUrl(url);
    setIsPdfModalOpen(true);
  };

  const handlePreview = (url:string) => {
    setImagePreviewUrl(url);
    setIsPreviewOpen(true);
  };

if(error){
  return <div><ErrorPage/></div>
}

  
  if(loading){
    return <div className='flex items-center justify-center h-full'>
      <BigLoader/>
      </div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft size={20} />
              Back to Submissions
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-800">
                Student Submission
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Student Answer */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <FileText size={28} />
                  Student Answer
                </h2>
              </div>

              <div className="p-8">
                <div className="prose prose-lg max-w-none">
                  <div className="bg-gray-50 rounded-xl p-6 border-l-4 border-blue-500">
                    <pre className="text-gray-700 leading-relaxed whitespace-pre-wrap font-sans text-sm">
                      {studentAnswers?.text}
                    </pre>
                  </div>
                </div>
              </div>
            </div>

            {/* Images Section */}
            {studentAnswers?.images && studentAnswers?.images.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-6">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <Image size={28} />
                    Submitted Images
                  </h2>
                </div>

                <div className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {studentAnswers?.images.map((imageUrl, index) => (
                      <div
                        key={index}
                        className="relative rounded-xl overflow-hidden shadow-lg hover:shadow-xl"
                      >
                        <img
                          src={imageUrl}
                          alt={`image-${index}`}
                          className="w-full h-70 object-cover hover:scale-105 transition-transform"
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
              </div>
            )}

            {/* Attachments Section */}
            {studentAnswers?.attachments && studentAnswers?.attachments.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-green-600 to-teal-600 px-8 py-6">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <FileText size={28} />
                    Attachments
                  </h2>
                </div>

                <div className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {studentAnswers?.attachments.map((attachment, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-red-50 border border-red-100 rounded-xl"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-white" />
                          </div>
                          <span className="font-medium text-gray-800">
                            {attachment.split("/").pop()}
                          </span>
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
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Student Info Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <User size={22} />
                  Student Info
                </h3>
              </div>

              <div className="p-6 space-y-4">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-3">
                    {submittedStudent.name.charAt().toUpperCase()}
                  </div>
                  <h4 className="text-xl font-bold text-gray-800">
                    {submittedStudent.name}
                  </h4>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <Mail size={18} className="text-blue-600" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">
                        Email
                      </p>
                      <p className="text-sm font-medium text-gray-800">
                        {submittedStudent.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                    <GraduationCap size={18} className="text-purple-600" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">
                        Class
                      </p>
                      <p className="text-sm font-medium text-gray-800">
                        {submittedStudent.class}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <Clock size={18} className="text-green-600" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">
                        Submitted
                      </p>
                      <p className="text-sm font-medium text-gray-800">
                        {formatDate(submittedStudent.submissionDate)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-teal-500 to-cyan-500 px-6 py-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Star size={22} />
                  Quick Actions
                </h3>
              </div>

              <div className="p-6 space-y-3">
                <button disabled={studentAnswers?.grade !== null} onClick={()=>{setIsModalGrade(true)}} className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-sm hover:shadow-md">
                  <Award size={18} />
                  {studentAnswers?.grade ===null ? "Grade Submission" : "Already Submitted"}
                </button>

                <button className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-sm hover:shadow-md">
                  <FileText size={18} />
                  Add Feedback
                </button>

                <button className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-sm hover:shadow-md">
                  <Download size={18} />
                  Export Report
                </button>
              </div>
            </div>

            {/* Submission Stats */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-500 to-blue-500 px-6 py-4">
                <h3 className="text-xl font-bold text-white">
                  Submission Details
                </h3>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Images</span>
                  <span className="font-bold text-indigo-600">
                    {studentAnswers?.images?.length || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Attachments</span>
                  <span className="font-bold text-indigo-600">
                    {studentAnswers?.attachments?.length || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Word Count</span>
                  <span className="font-bold text-indigo-600">
                    {studentAnswers?.text.split(" ").length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isPdfModalOpen && (
        <PdfViewerModal
          fileUrl={pdfUrl!}
          isOpen={isPdfModalOpen}
          onClose={() => setIsPdfModalOpen(false)}
        />
      )}
      {isPreviewOpen && (
        <ViewImageModal
          imagePreviewUrl={imagePreviewUrl}
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
        />
      )}
      {
        isGradeModal && studentAnswers &&(
          <GradeForSubmissionModal
          isOpen={isGradeModal}
          onClose={()=>setIsModalGrade(false)}
          submissionId={studentAnswers.id}
          submissionDate={studentAnswers?.createdAt}
          studentName={submittedStudent?.name}
          totalMark={studentAnswers?.marks}
          />
        )
      }
    </div>
  );
};

export default ViewStudentAnswer;
