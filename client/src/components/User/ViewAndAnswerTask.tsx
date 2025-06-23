import { useForm } from "react-hook-form";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Clock,
  BookOpen,
  User,
  FileText,
  Paperclip,
  Send,
  X,
  Download,
  Eye,
} from "lucide-react";
import InputField from "../../common/ui/InputField";
import ImageInputField from "../../common/ui/ImageInputField";
import { formatDate } from "../../utils/formateDate";
import { useState } from "react";
import PdfViewerModal from "../../common/modal/PdfViewerModal";
import { handleDownload } from "../../utils/downloadDatas";
import useAddTaskAnswer from "../../services/studentManagments/useAddTaskAnswer";
import { useSelector } from "react-redux";
import type { RootState } from "../../state/redux/store/store";
import { toast } from "sonner";

const ViewAndAnswerTask = () => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [currentPreviewUrl, setCurrentPreviewUrl] = useState("");
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);

  const location = useLocation();
  const task = location.state?.task;
console.log("LOG",task);

const studentId = useSelector((state:RootState)=>state.studentAuth.id) || undefined

  const {addTaskAnswer,error,loading} = useAddTaskAnswer()

  const { id } = useParams();
  const navigate = useNavigate();

  const { control, handleSubmit, reset, formState: { isSubmitting } } = useForm({
    mode: "onBlur",
    defaultValues: {
      answer: "",
      attachments: null,
      images: null,
    },
  });

  const onSubmit = async (data) => {
    try {
       const { attachments, images, ...rest } = data;
    const formData = new FormData();
console.log("LOF",data);

    formData.append('text', rest.answer);
    formData.append('marks', task.maxMarks);
    formData.append('taskId', id!);
    formData.append('teacherId', task.teacherId);
    formData.append('studentId', studentId!);

    if (attachments && attachments.length > 0) {
      attachments.forEach((item) => {
        if (item.file) {
          formData.append('attachments', item.file);
        } else if (item instanceof File) {
          formData.append('attachments', item);
        }
      });
    }

    if (images && images.length > 0) {
      images.forEach((item) => {
        if (item.file) {
          formData.append('images', item.file); 
        } else if (item instanceof File) {
          formData.append('images', item); 
        }
      });
    }
        const response = await addTaskAnswer(formData)
        if(response){
            navigate('/all-tasks')
            toast.success('Answer Submitted Successfully')
        }else{
            toast.error(error?.message|| "Error occured while submitting the answer")
        }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Failed to submit answer. Please try again.");
    }
  };

  const onCancel = () => {
    reset();
    navigate(-1);
  };

  const handlePdfPreview = (url) => {
    setPdfUrl(url);
    setIsPdfModalOpen(true);
  };

  const handlePreview = (url) => {
    setCurrentPreviewUrl(url);
    setIsPreviewOpen(true);
  };
  const closePreview = () => setIsPreviewOpen(false);



  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative">
      {/* Modal preview */}
      {isPreviewOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <button
            className="absolute top-4 right-4 p-2 bg-white rounded-full"
            onClick={closePreview}
          >
            <X className="w-6 h-6 text-black" />
          </button>
          {currentPreviewUrl.endsWith(".pdf") ? (
            <iframe
              src={currentPreviewUrl}
              className="w-full h-full border-none"
            ></iframe>
          ) : (
            <img
              src={currentPreviewUrl}
              alt="Preview"
              className="max-h-full max-w-full object-contain"
            />
          )}
        </div>
      )}

      <div className="relative z-10 max-w-6xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center justify-center w-12 h-12 bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl shadow-lg hover:shadow-xl hover:bg-indigo-50 transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:text-indigo-600 transition-colors" />
          </button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Task Details & Answer
            </h1>
            <p className="text-gray-600">Complete your assignment submission</p>
          </div>
        </div>

        {/* Task Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
          {/* Task Header */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-8 text-white">
            <h2 className="text-2xl font-bold mb-2">{task.title}</h2>
            <div className="flex flex-wrap items-center gap-6 text-indigo-100">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span className="font-medium">{task.subject}</span>
              </div>
              {task.teacherName && (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span className="font-medium">{task.teacherName}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span className="font-medium">{task.maxMarks} Marks</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 space-y-8">
            {task.description && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-600" /> Description
                </h3>
                <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                  {task.description}
                </p>
              </div>
            )}

            {task.text && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Additional Instructions</h3>
                <p className="text-gray-700 leading-relaxed bg-blue-50 p-4 rounded-xl border border-blue-100">
                  {task.text}
                </p>
              </div>
            )}

            {/* Dates */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="font-semibold text-green-800">Assigned Date</h4>
                </div>
                <p className="text-green-700 font-medium">{formatDate(task.assignedDate)}</p>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-2xl border border-orange-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="font-semibold text-orange-800">Due Date</h4>
                </div>
                <p className="text-orange-700 font-medium">{formatDate(task.dueDate)}</p>
              </div>
            </div>

            {/* Attachments */}
            {(task.attachments?.length > 0 || task.images?.length > 0) && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Paperclip className="w-5 h-5 text-indigo-600" />
                  Attachments
                </h3>
                <div className="space-y-4">
                  {/* PDFs */}
                  {task.attachments?.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-700 mb-3">Documents</h4>
                      <div className="grid gap-3">
                        {task.attachments.map((attachment, index) => (
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
                  {task.images?.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-700 mb-3">Images</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {task.images.map((imageUrl, index) => (
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
        </div>

        {/* Answer Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <Send className="w-6 h-6" />
              Submit Your Answer
            </h2>
            <p className="text-emerald-100 mt-1">Provide your solution and upload any supporting files</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-8">
            <InputField
              control={control}
              name="answer"
              label="Your Answer"
              placeholder="Write your detailed answer here..."
              multiline={true}
              rows={8}
              required={true}
              icon={<FileText className="w-4 h-4" />}
            />

            <ImageInputField
              control={control}
              name="attachments"
              label="Upload Files"
              multiple={true}
              acceptedTypes={[".pdf", ".doc", ".docx"]}
              error="Invalid file type."
            />

            <ImageInputField
              control={control}
              name="images"
              label="Upload Images"
              multiple={true}
              acceptedTypes={["image/*"]}
              error="Invalid file type."
            />

            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onCancel}
                disabled={isSubmitting || loading}
                className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" /> Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || loading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                {isSubmitting || loading ? "Submitting..." : "Submit Answer"}
              </button>
            </div>
          </form>
        </div>
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
    </div>
  );
};

export default ViewAndAnswerTask;