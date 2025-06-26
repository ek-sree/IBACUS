import { Plus } from "lucide-react";
import { useState } from "react";
import AddUser from "./AddStudents";
import StudentsListTable from "./StudentsListTable";

const Students = () => {
  const [isAddUserOpen, setIsUserOpen] = useState<boolean>(false);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  const handleAddSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
    setIsUserOpen(false);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Student Management
          </h1>
          <p className="text-gray-600">Manage and track your user</p>
        </div>
        <button
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
          onClick={() => setIsUserOpen(true)}
        >
          <Plus className="h-5 w-5" />
          Add Student
        </button>
      </div>

      {isAddUserOpen && (
        <AddUser
          isOpen={isAddUserOpen}
          onClose={() => setIsUserOpen(false)}
          onSuccess={handleAddSuccess}
        />
      )}

      <StudentsListTable key={refreshTrigger} />
    </div>
  );
};

export default Students;
