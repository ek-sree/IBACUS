import { Edit, GraduationCap, Mail, Save, User } from 'lucide-react';
import InputField from '../../common/ui/InputField';
import { useForm } from 'react-hook-form';
import React from 'react';
import type { Student } from '../../services/TeacherManagment/useFetchStudents';
import { toast } from 'sonner';
import useEditStudent from '../../services/TeacherManagment/useEditStudent';

interface EditStudentModalProps {
  isOpen: boolean;
  onClose?(): void;
  studentData?: Student;
  onSuccess:(updatedStudent: Student)=>void;
}

const EditStudentModal: React.FC<EditStudentModalProps> = ({ isOpen, onClose, studentData, onSuccess }) => {  
    
  const { control, handleSubmit } = useForm({
    defaultValues: {
      name: studentData?.name || '',
      email: studentData?.email || '',
      class: studentData?.class || ''
    }
  });


  const id = studentData?.id

  const {editStudent,error,loading} = useEditStudent()

  const onSubmit = async (data:Student) => {
    if(!id)return 
    const result = await editStudent(id,data)
    if(result){
      toast.success('Student updated successfully')
      onSuccess(result.data)
    }else{
      toast.error(error?.message || "Something went wrong!")
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="relative overflow-hidden rounded-t-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 p-6">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Edit className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Edit Student</h2>
                <p className="text-blue-100 text-sm">Update student information</p>
              </div>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-white/5 rounded-full blur-lg"></div>
        </div>

        {/* Form */}
        <div className="p-6 space-y-6">
          <div className="space-y-5">
            <InputField
              control={control}
              name="name"
              label="Full Name"
              placeholder="Enter student's full name"
              required
              icon={<User className="w-4 h-4" />}
              className="transform transition-all duration-200 hover:scale-[1.02]"
            />
            
            <InputField
              control={control}
              name="email"
              label="Email Address"
              placeholder="Enter email address"
              type="email"
              required
              icon={<Mail className="w-4 h-4" />}
              className="transform transition-all duration-200 hover:scale-[1.02]"
            />
            
            <InputField
              control={control}
              name="class"
              label="Class"
              placeholder="Enter class/grade"
              required
              icon={<GraduationCap className="w-4 h-4" />}
              className="transform transition-all duration-200 hover:scale-[1.02]"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all duration-200 font-medium hover:scale-[1.02] active:scale-[0.98]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit(onSubmit)}
              disabled={loading}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all duration-200 font-medium hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Bottom decoration */}
        <div className="h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-b-2xl"></div>
      </div>
    </div>
  );
};

export default EditStudentModal;