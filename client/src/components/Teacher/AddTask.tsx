import { useForm } from "react-hook-form";
import { 
  BookOpen, 
  Users, 
  FileText, 
  Save, 
  Plus,
  Calendar,
  AlertTriangle,
  X,
} from "lucide-react";
import InputField from "../../common/ui/InputField";
import DateInputField from "../../common/ui/DateInputField";
import ImageInputField from "../../common/ui/ImageInputField";
import useFetchStudentAndClass from "../../services/TeacherManagment/useFetchStudentAndClass";
import DropdownField from "../../common/ui/DropDownField";
import useAddTask from "../../services/TaskManagment/useAddTask";
import { useSelector } from "react-redux";
import type { RootState } from "../../state/redux/store/store";
import { toast } from "sonner";

interface FileItem {
  file: File;
  preview: string;
  id: string;
}

interface TaskFormData {
  title: string;
  description: string;
  subject: string;
  dueDate: string;
  assignedDate: string;
  attachments: FileItem[];
  images: FileItem[];
  text: string;
  classrooms: string[];
  students: string[];
  maxMarks: number;
}

interface UploadedFile {
  id?: string;          
  file: File;
  preview?: string | null;
  lastModified?: number;
  lastModifiedDate?: Date;
  name?: string;
  size?: number;
  type?: string;
}

export interface Task {
  title: string;
  description?: string;
  subject: string;
  assignedDate: string;  
  dueDate: string;     
  text: string;
  maxMarks: number | string;
  attachments?: UploadedFile[]; 
  images?: UploadedFile[];     
  students?: string[];   
  classrooms?: string[]; 
}


interface AddTaskProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess:(tasks:Task)=>void
}

const AddTask = ({ isOpen, onClose,onSuccess }: AddTaskProps) => {
  const { 
    control, 
    handleSubmit, 
    formState: { errors, isSubmitting }, 
    getValues,
    reset
  } = useForm<TaskFormData>({
    defaultValues: {
      title: "",
      description: "",
      subject: "",
      dueDate: "",
      assignedDate: new Date().toISOString().split('T')[0],
      attachments: [],
      images: [],
      text: "",
      classrooms: [],
      students: [],
      maxMarks: 0,
    },
    mode: "onChange",
  });

  const {addTask,error:addTaskError,loading} = useAddTask()

  const teacherId = useSelector((state:RootState)=>state.teacherAuth.id)

  const subjectOptions = [
    { value: "mathematics", label: "Mathematics" },
    { value: "science", label: "Science" },
    { value: "english", label: "English" },
    { value: "history", label: "History" },
    { value: "geography", label: "Geography" },
    { value: "physics", label: "Physics" },
    { value: "chemistry", label: "Chemistry" },
    { value: "biology", label: "Biology" },
  ];

 


  const {data,error:errorFetchingStudentClass,isLoading} = useFetchStudentAndClass()



  const classroomOptions = data.data?.className?.map(classRoom=>({
    value: classRoom.value,
    label: classRoom.label
  })) ||[]

  const studentOptions = data.data?.students?.map(student=>({
    value: student.id,
    label: `${student.name} - ${student.class}`
  }))||[]

  

  const onSubmit = async (data: TaskFormData) => {
    try {
      const submitData = new FormData();
      
      submitData.append('title', data.title);
      submitData.append('description', data.description);
      submitData.append('subject', data.subject);
      submitData.append('dueDate', data.dueDate);
      submitData.append('assignedDate', data.assignedDate);
      submitData.append('text', data.text);
      submitData.append('maxMarks', data.maxMarks.toString());
      submitData.append('classrooms', JSON.stringify(data.classrooms));
      submitData.append('students', JSON.stringify(data.students));
      
      data.attachments.forEach((item) => {
      submitData.append('attachments', item.file); 
    });

    data.images.forEach((item) => {
      submitData.append('images', item.file); 
    });
if(!teacherId)return alert('credientials missing login again')
      const result = await addTask(submitData,teacherId)
    
      if(result){
        reset();
        onSuccess(result)
      }
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Failed to create task. Please try again.');
    }
  };

  if(addTaskError){
    toast.error(addTaskError?.message || "Error occured while adding task")
  }

  if (!isOpen) return null;
if (isLoading) {
  return <div>Loading students...</div>;
}

  return (
    <div className="fixed inset-0 bg-gray-600/70 backdrop-blur-lg z-50 overflow-y-auto">
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-2 rounded-lg mr-3 text-white">
                <Plus className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Create New Task</h1>
                <p className="text-sm text-gray-600">Assign tasks to students or classrooms</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-gray-700"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Information */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-6 transition-all hover:shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
                  Basic Information
                </h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="lg:col-span-2">
                    <InputField
                      control={control}
                      name="title"
                      label="Task Title"
                      placeholder="Enter task title"
                      required
                      className="w-full"
                      error={errors.title}
                    />
                  </div>
                  
                  <div className="lg:col-span-2">
                    <InputField
                      control={control}
                      name="description"
                      label="Description"
                      placeholder="Enter task description (optional)"
                      multiline
                      rows={3}
                      className="w-full"
                    />
                  </div>
                  
                  <DropdownField
                    control={control}
                    name="subject"
                    label="Subject"
                    options={subjectOptions}
                    placeholder="Select subject"
                    required
                    className="w-full"
                    error={errors.subject}
                  />
                  
                  <InputField
                    control={control}
                    name="maxMarks"
                    label="Maximum Marks"
                    type="number"
                    placeholder="Enter maximum marks"
                    required
                    className="w-full"
                    error={errors.maxMarks}
                    rules={{
                      min: { value: 1, message: "Maximum marks must be greater than 0" },
                    }}
                  />
                </div>
              </div>

              {/* Schedule */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100 p-6 transition-all hover:shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-green-600" />
                  Schedule
                </h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <DateInputField
                    control={control}
                    name="assignedDate"
                    label="Assigned Date"
                    className="w-full"
                    required
                    rules={{
                      validate: {
                        notPast: (value) => {
                          const today = new Date().toISOString().split('T')[0];
                          return value >= today || "Assign date cannot be in the past";
                        },
                      },
                    }}
                    error={errors.assignedDate}
                  />
                  
                  <DateInputField
                    control={control}
                    name="dueDate"
                    label="Due Date"
                    required
                    className="w-full"
                    error={errors.dueDate}
                    rules={{
                      validate: {
                        notPast: (value) => {
                          const today = new Date().toISOString().split('T')[0];
                          return value >= today || "Due date cannot be in the past";
                        },
                      },
                    }}
                  />
                </div>
              </div>

              {/* Assignment */}
              <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl border border-purple-100 p-6 transition-all hover:shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Users className="h-5 w-5 mr-2 text-purple-600" />
                  Assignment
                </h2>
                
                {(errors.classrooms || errors.students) && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
                    <AlertTriangle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                    <span className="text-red-700 text-sm">
                      Please select at least one classroom or student
                    </span>
                  </div>
                )}
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                 <DropdownField
  control={control}
  name="classrooms"
  label="Assign to Classrooms"
  options={classroomOptions}
  isMulti
  placeholder="Select classrooms"
  className="w-full"
  error={errors.classrooms}
  rules={{
    validate: {
      atLeastOne: (value) => {
        const students = getValues("students");
        return (value?.length > 0 || students?.length > 0) || "Please select at least one classroom or student";
      },
    },
  }}
/>

<DropdownField
  control={control}
  name="students"
  label="Assign to Individual Students"
  options={studentOptions}
  isMulti
  placeholder="Select students"
  className="w-full"
  error={errors.students}
  rules={{
    validate: {
      atLeastOne: (value) => {
        const classrooms = getValues("classrooms");
        return (value?.length > 0 || classrooms?.length > 0) || "Please select at least one classroom or student";
      },
    },
  }}
/>
                </div>
              </div>

              {/* Task Content */}
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-100 p-6 transition-all hover:shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-orange-600" />
                  Task Content
                </h2>
                
                {(errors.text || errors.attachments || errors.images) && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
                    <AlertTriangle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                    <span className="text-red-700 text-sm">
                      Please provide task content (text, attachments, or images)
                    </span>
                  </div>
                )}
                
                <div className="space-y-4">
                  <InputField
                    control={control}
                    name="text"
                    label="Task Instructions"
                    placeholder="Enter detailed task instructions..."
                    multiline
                    rows={4}
                    className="w-full"
                    error={errors.text}
                    rules={{
                      validate: {
                        hasContent: () => {
                          const text = getValues("text");
                          const attachments = getValues("attachments");
                          const images = getValues("images");
                          return (
                            (text && text.trim() !== "") ||
                            attachments.length > 0 ||
                            images.length > 0
                          ) || "Please provide task content (text, attachments, or images)";
                        },
                      },
                    }}
                  />
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <ImageInputField
                      control={control}
                      name="attachments"
                      label="Attachments"
                      multiple
                      acceptedTypes={[ '.pdf', '.doc', '.docx', '.txt']}
                      className="w-full"
                      error={errors.attachments}
                      rules={{
                        validate: {
                          hasContent: () => {
                            const text = getValues("text");
                            const attachments = getValues("attachments");
                            const images = getValues("images");
                            return (
                              (text && text.trim() !== "") ||
                              attachments.length > 0 ||
                              images.length > 0
                            ) || "Please provide task content (text, attachments, or images)";
                          },
                        },
                      }}
                    />
                    
                    <ImageInputField
                      control={control}
                      name="images"
                      label="Images"
                      multiple
                      acceptedTypes={['image/*']}
                      className="w-full"
                      error={errors.images}
                      rules={{
                        validate: {
                          hasContent: () => {
                            const text = getValues("text");
                            const attachments = getValues("attachments");
                            const images = getValues("images");
                            return (
                              (text && text.trim() !== "") ||
                              attachments.length > 0 ||
                              images.length > 0
                            ) || "Please provide task content (text, attachments, or images)";
                          },
                        },
                      }}
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 z-10">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              className="w-full sm:w-auto px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all shadow-md hover:shadow-lg"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating Task...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Create Task
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTask;