import { useState, useMemo, useEffect } from "react";
import { Search, Eye, Edit2, Trash2 } from "lucide-react";
import { useForm, FormProvider } from "react-hook-form";
import DropdownField from "../../common/ui/DropDownField";
import useDebounce from "../../hooks/useDebounce";
import { toast } from "sonner";
import useDeleteStudent from "../../services/TeacherManagment/useDeleteStudent";
import DeleteConfirmationModal from "../../common/modal/DeleteConformationModal";
import { useSelector } from "react-redux";
import type { RootState } from "../../state/redux/store/store";
import useFetchStudents from "../../services/TeacherManagment/useFetchStudents";
import EditStudentModal from "./EditStudentModal";
import DotLoading from "../../common/components/DotLoading";
import ErrorPage from "../../common/components/ErrorPage";
import type { Student } from "../../interface/student";
import Pagination from "../../common/ui/Pagination";
import SingleStudentViewModal from "./SingleStudentViewModal";

interface FormValues {
  selectedClass: string;
}


const StudentsListTable = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(5);
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>("");
  const [isDeleteModal, setIsDeleteModal] = useState<boolean>(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [studentList, setStudentList] = useState<Student[]>([]);
  const [isEditModal,setIsEditModal] = useState<boolean>(false);
  const [isStudentViewModal,setIsStudentViewModal] = useState<boolean>(false);


  const teacherId = useSelector((state:RootState)=>state.teacherAuth.id) || ""

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { students,totalCount, loading, error } = useFetchStudents(teacherId,currentPage,itemsPerPage,selectedClassFilter,debouncedSearchTerm);
  const {deleteStudent,error:deleteError,isLoading,resetError} = useDeleteStudent()

console.log(students);

  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const paginatedStudents = studentList;


 useEffect(() => {
    setStudentList(students);
  }, [students]);


  const methods = useForm<FormValues>({
    defaultValues: {
      selectedClass: "",
    },
  });

  const classOptions = useMemo(() => {
    const classes = Array.from(new Set(students.map((student) => student.class)));
    return [
      { value: "", label: "All Classes" },
      ...classes.map((cls) => ({ value: cls.toString(), label: `${cls}` })),
    ];
  }, [students]);



  const handleClassChange = (value: string) => {
    setSelectedClassFilter(value);
    setCurrentPage(1);
  };

  const handleDelete = async (id: string) => {
  if (!selectedStudentId) return;
  try {
    const response =  await deleteStudent(id);
    if(response){
      setIsDeleteModal(false);
      toast.success("Student deleted successfully");
      setStudentList((prev) => prev.filter((student) => student.id !== id));
    }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err:any) {
    toast.error("Failed to delete student",err?.message);
  }
};

const handleEditSuccess=(updatedStudent:Student)=>{  
  setStudentList((prev)=>prev.map((student)=>student.id===updatedStudent.id ? updatedStudent : student))
  setIsEditModal(false)
}
  
 if (error) {
  toast.error(error ||"Something went wrong! Please try again later.");
  return <div className="text-red-500 text-center p-4"><ErrorPage/></div>;
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="rounded-2xl shadow-xl border border-gray-100 p-6 mb-6 backdrop-blur-sm bg-white/90 relative z-10">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/50"
              />
            </div>
            <div className="flex items-center gap-4">
              <FormProvider {...methods}>
                <div className="relative z-50">
                  <DropdownField
                    control={methods.control}
                    name="selectedClass"
                    label="Filter by Class"
                    options={classOptions}
                    placeholder="Select Class"
                    className="w-48"
                    onChange={handleClassChange}
                  />
                </div>
              </FormProvider>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-2xl shadow-xl border border-gray-100 overflow-hidden backdrop-blur-sm bg-white/90 relative z-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Email</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Class</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedStudents.map((student) => (
                  <tr
                    key={student.id}
                    className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 transition-all duration-200 group"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                        {student.name}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-blue-800">
                        {student.email}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold">
                        {student.class}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center space-x-2">
                        <button onClick={()=>{setIsStudentViewModal(true);setSelectedStudentId(student?.id || null)}} className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-all duration-200 hover:scale-110">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={()=>{setIsEditModal(true);setSelectedStudentId(student?.id || null)}} className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-all duration-200 hover:scale-110">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={()=>{setIsDeleteModal(true);setSelectedStudentId(student?.id || null)}} className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all duration-200 hover:scale-110">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {paginatedStudents.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-lg mb-2">No students found</div>
                <div className="text-gray-500 text-sm">Try adjusting your search criteria</div>
              </div>
            )}
            {
              loading && (
                <div className="flex justify-center items-center h-64">
                  <DotLoading/>
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
        />
      </div>
      {
        isDeleteModal &&(
          <DeleteConfirmationModal
          isOpen={isDeleteModal}
          onClose={()=>{setIsDeleteModal(false);setSelectedStudentId(null) ;resetError()}}
          onConfirm={()=>handleDelete(selectedStudentId!)}
          message={"Are you sure you want to delete this student? This action cannot be undone."}
          title={"Delete Student"}
          error={deleteError}
          isLoading={isLoading}
          />
        )
      }
      {
        isEditModal &&(
          <EditStudentModal
          isOpen={isEditModal}
          onClose={()=>{setIsEditModal(false);setSelectedStudentId(null)}}
          studentData={studentList.find((student)=>student.id===selectedStudentId)!}
          onSuccess={handleEditSuccess}
          />
        )
      }
      {
        isStudentViewModal &&(
          <SingleStudentViewModal
          isOpen={isStudentViewModal}
          onClose={()=>setIsStudentViewModal(false)}
          studentData={studentList.find((student)=>student.id===selectedStudentId)!}
          />
        )
      }
    </div>
  );
};

export default StudentsListTable;
