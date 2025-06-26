import { useEffect, useState } from "react";
import {
  Search,
  Eye,
  Trash2,
  Calendar,
} from "lucide-react";
import useFetchTask from "../../services/TaskManagment/useFetchTask";
import useDebounce from "../../hooks/useDebounce";
import { useSelector } from "react-redux";
import type { RootState } from "../../state/redux/store/store";
import DropdownField from "../../common/ui/DropDownField";
import { useForm } from "react-hook-form";
import { formatDate } from "../../utils/formateDate";
import { sortOptions } from "../../constants/data";
import DeleteConfirmationModal from "../../common/modal/DeleteConformationModal";
import useDeleteTask from "../../services/TaskManagment/useDeleteTask";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import SmallLoader from "../../common/components/SmallLoader";
import Pagination from "../../common/ui/Pagination";
import type { Task } from "../../interface/tsk";


const TaskListTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [sort, setSort] = useState<string>("");
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [selectedTaskId, setSelecteTaskId] = useState<string | null>(null);
  const [taskLists,setTaskLists] = useState<Task[]>([])


const methods = useForm();

  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const teacherId = useSelector((state:RootState)=>state?.teacherAuth?.id)|| undefined;

  const { tasks, totalCount, loading, error } = useFetchTask(currentPage,itemsPerPage,debouncedSearchTerm,sort,teacherId);
  const {deleteTask,error:isDeleteError,loading:isDeleteLoading,resetError} = useDeleteTask()

  const navigate = useNavigate();
  
  useEffect(()=>{
    setTaskLists(tasks)
  },[tasks])

  const paginatedStudents=taskLists
   

  const totalPages = Math.ceil(totalCount / itemsPerPage);
  
const handleDelete=async(id:string)=>{
  try {
    if(!selectedTaskId){
      alert("An error occured")
      return
    };
    const res =await deleteTask(id)
    if(res){
      setTaskLists(prev=> prev.filter(item=>item.id!==id))
      toast.success('Task deleted successfully')
      setShowDeleteModal(false)
    }
  }catch(err){
    console.log(err)
  }
}


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="rounded-2xl shadow-xl border border-gray-100 p-6 mb-6 bg-white/90 relative z-10">
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
      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    />
  </div>

  <DropdownField
  control={methods.control}
  name="sort"
  label="Sort By"
  options={sortOptions}
  placeholder="Sort"
  className="w-48"
  onChange={(val) => {
    setSort(val);  
    setCurrentPage(1); 
  }}
/>
</div>
        </div>

        {/* Table */}
        <div className="rounded-2xl shadow-xl border border-gray-100 overflow-hidden bg-white/90">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    <button className="flex items-center gap-2">
                      Title 
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    <button  className="flex items-center gap-2">
                      Subject
                    </button>
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                    <button className="flex items-center gap-2">
                      Marks 
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    <button  className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" /> Assigned
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    <button className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" /> Due 
                    </button>
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedStudents.map((task) => (
                  <tr
                    key={task.id}
                    className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 transition-all"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">{task.title}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        {task.subject}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-gray-900">{task.maxMarks}</td>
                    <td className="px-6 py-4 text-gray-600">{formatDate(task.assignedDate)}</td>
                    <td className="px-6 py-4 text-gray-600">{formatDate(task.dueDate)}</td>
                    <td className="px-6 py-4 flex justify-center space-x-2">
                      <button onClick={() => navigate(`/teacher/view-task/${task.id}` ,{ state: { task } })} className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"><Eye className="w-4 h-4" /></button>
                      {/* <button className="p-2 text-green-600 hover:bg-green-100 rounded-lg"><Edit2 className="w-4 h-4" /></button> */}
                      <button onClick={()=>{setShowDeleteModal(true); setSelecteTaskId(task.id)}} className="p-2 text-red-600 hover:bg-red-100 rounded-lg"><Trash2 className="w-4 h-4" /></button>
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
                <div><SmallLoader/></div>
              )
            }
            {
              error && (
                <div className="text-center py-12">
                  <div className="text-red-500 text-lg mb-2">Error fetching students</div>
                  <div className="text-gray-500 text-sm">{error}</div>
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
        itemsPerPage={itemsPerPage}
        />
      </div>
      {
        showDeleteModal &&(
          <DeleteConfirmationModal
          isOpen={showDeleteModal}
          onClose={()=>{setShowDeleteModal(false); setSelecteTaskId(null); ;resetError()}}
          onConfirm={()=>handleDelete(selectedTaskId!)}
          error={isDeleteError}
          isLoading={isDeleteLoading}
          message="Are you sure you want to delete this task? This action cannot be undone."
          title="Delete Task"
          />
        )
      }
    </div>
  );
};

export default TaskListTable;
