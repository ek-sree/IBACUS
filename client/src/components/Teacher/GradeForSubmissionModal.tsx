import { useForm, type SubmitHandler } from 'react-hook-form';
import { X, Award,  BookOpen } from 'lucide-react';
import InputField from '../../common/ui/InputField';
import useAddSubmissionGrade from '../../services/TeacherManagment/useAddSubmissionGrade';
import { toast } from 'sonner';
import type React from 'react';
import type { GradeFormValues, GradeForSubmissionModalProps } from '../../interface/gradeSubmission';


const GradeForSubmissionModal: React.FC<GradeForSubmissionModalProps> = ({isOpen,onClose,submissionId,submissionDate,studentName,totalMark=0}) => {  
  
  const { control, handleSubmit, watch,  } = useForm<GradeFormValues>({
    defaultValues: {
      gradeMarks: '',
      // feedback: ''
    }
  });

  const {addSubmissionGrade,error,loading} = useAddSubmissionGrade()
  
  const gradeMarks = watch('gradeMarks');
  const percentage = gradeMarks ? Math.round((parseFloat(gradeMarks) / totalMark) * 100) : 0;
  
  const getGradeColor = (percentage:number) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 80) return 'text-blue-600';
    if (percentage >= 70) return 'text-yellow-600';
    if (percentage >= 60) return 'text-orange-600';
    return 'text-red-600';
  };
  
  const getGradeLetter = (percentage:number) => {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B';
    if (percentage >= 60) return 'C';
    return 'F';
  };
  
  const onSubmit:SubmitHandler<GradeFormValues> = async (data) => {

    if(!submissionId){
      toast.error("An error occured try later")      
      return
    }
    const response = await addSubmissionGrade(submissionId,data.gradeMarks);
    if(response){
      onClose();
      toast.success('Grade submitted successfully.');
    }else{
      toast.error(error || 'Failed to submit grade.');
    }
    
  };
  
  if (!isOpen || !submissionId) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
          >
            <X size={24} />
          </button>
          <div className="flex items-center gap-3">
            <div className="bg-white bg-opacity-20 p-2 rounded-full">
              <Award size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold">Grade Submission</h2>
              <p className="text-blue-100 text-sm">Evaluate student performance</p>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6">
          {/* Student Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen size={18} className="text-gray-600" />
              <span className="font-medium text-gray-800">Assignment Details</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Student:</span>
                <span className="font-medium">{studentName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Submitted:</span>
                <span className="font-medium">{submissionDate}</span>
              </div>
            </div>
          </div>
          
          {/* Total Marks Display */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="text-center">
              <p className="text-gray-600 text-sm mb-1">Total Marks</p>
              <p className="text-3xl font-bold text-blue-600">{totalMark}</p>
            </div>
          </div>
          
          {/* Grade Preview */}
          {gradeMarks && (
            <div className="bg-white border-2 border-dashed border-gray-200 rounded-lg p-4 mb-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-4 mb-2">
                  <div className="text-2xl font-bold text-gray-800">
                    {gradeMarks}/{totalMark}
                  </div>
                  <div className={`text-xl font-bold ${getGradeColor(percentage)}`}>
                    {getGradeLetter(percentage)}
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      percentage >= 90 ? 'bg-green-500' :
                      percentage >= 80 ? 'bg-blue-500' :
                      percentage >= 70 ? 'bg-yellow-500' :
                      percentage >= 60 ? 'bg-orange-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  ></div>
                </div>
                <p className={`text-sm font-medium ${getGradeColor(percentage)}`}>
                  {percentage}%
                </p>
              </div>
            </div>
          )}
          
          {/* Form */}
          <div className="space-y-4">
            <InputField
              control={control}
              name="gradeMarks"
              label="Grade Marks"
              placeholder={`Enter marks (0-${totalMark})`}
              type="number"
              required={true}
              icon={<Award size={18} />}
              rules={{
                min: {
                  value: 0,
                  message: "Grade cannot be negative"
                },
                max: {
                  value: totalMark,
                  message: `Grade cannot exceed ${totalMark} marks`
                },
                pattern: {
                  value: /^\d*\.?\d*$/,
                  message: "Please enter a valid number"
                }
              }}
            />
{/*             
            <InputField
              control={control}
              name="feedback"
              label="Feedback (Optional)"
              placeholder="Provide feedback for the student..."
              multiline={true}
              rows={3}
              icon={<AlertCircle size={18} />}
            /> */}
            
            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                onClick={handleSubmit(onSubmit)}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Submitting...
                  </>
                )  : (
                  <>
                    <Award size={18} />
                    Submit Grade
                  </>
                )}
              </button>
            </div>
                      </div>
        </div>
      </div>
    </div>
  );
};

export default GradeForSubmissionModal;