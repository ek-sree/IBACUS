import { X, User, Mail, GraduationCap, Calendar } from "lucide-react";
import type { Student } from "../../interface/student";
import { formatDate } from "../../utils/formateDate";

interface SingleStudentViewModalProps {
  isOpen: boolean;
  onClose?(): void;
  studentData?: Student;
}

export default function SingleStudentViewModal({ isOpen, onClose, studentData }:SingleStudentViewModalProps) {
 

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 transform animate-slideUp">
        <div className="relative p-6 pb-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              User Information
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 group"
            >
              <X className="w-5 h-5 text-gray-500 group-hover:text-gray-700" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-2xl border border-blue-100 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-600 uppercase tracking-wide">Full Name</span>
              </div>
              <p className="text-lg font-semibold text-gray-800 ml-11">{studentData?.name || "N/A"}</p>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-2xl border border-green-100 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <Mail className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-600 uppercase tracking-wide">Email Address</span>
              </div>
              <p className="text-lg font-semibold text-gray-800 ml-11 break-all">{studentData?.email || "N/A"}</p>
            </div>

            <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-4 rounded-2xl border border-orange-100 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <GraduationCap className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-600 uppercase tracking-wide">Class</span>
              </div>
              <p className="text-lg font-semibold text-gray-800 ml-11">{studentData?.class || "N/A"}</p>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-2xl border border-purple-100 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-600 uppercase tracking-wide">Created Date</span>
              </div>
              <p className="text-lg font-semibold text-gray-800 ml-11">{formatDate(studentData?.createdAt) || 'N/A'}</p>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-medium transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Close
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}