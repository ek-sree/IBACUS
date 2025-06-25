import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { Upload, Plus, Trash2, X, Users, FileText, CheckCircle, User, Mail, GraduationCap, AlertCircle } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "../../state/redux/store/store";
import { checkDuplicateEmails } from "../../utils/checkDuplicateEmails";
import { toast } from 'sonner';
import InputField from "../../common/ui/InputField";
import useAddStudent from "../../services/TeacherManagment/useAddStudent";

const AddStudents = ({ isOpen, onClose,onSuccess }) => {
  const [activeTab, setActiveTab] = useState('csv');
  const [csvData, setCsvData] = useState([]);
  const [manualUsers, setManualUsers] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([{ id: Date.now() }]);
  const [csvFile, setCsvFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [duplicateEmails, setDuplicateEmails] = useState([]);

  const fileInputRef = useRef(null);
  const { control, handleSubmit: handleFormSubmit, reset, getValues } = useForm();

  const teacherId = useSelector((state:RootState)=>state.teacherAuth?.id);

  const {addStudent,error,loading} = useAddStudent()

  if (!isOpen) return null;

 

  // Handle CSV file upload
  const handleFileUpload = (file) => {
    if (file && file.type === 'text/csv') {
      setCsvFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        const rows = text.split('\n').filter(row => row.trim());
        const headers = rows[0].split(',').map(h => h.trim());
        
        if (headers.includes('name') && headers.includes('email') && headers.includes('class')) {
          const data = rows.slice(1).map(row => {
            const values = row.split(',').map(v => v.trim());
            return {
              id: Date.now() + Math.random(),
              name: values[headers.indexOf('name')] || '',
              email: values[headers.indexOf('email')] || '',
              class: values[headers.indexOf('class')] || ''
            };
          }).filter(user => user.name && user.email && user.class);
          
          const duplicates = checkDuplicateEmails(data);
          if (duplicates.length > 0) {
            setDuplicateEmails(duplicates);
            setCsvData([]);
            setCsvFile(null);
          } else {
            setDuplicateEmails([]);
            setCsvData(data);
          }
        }
      };
      reader.readAsText(file);
    }
  };

  // Handle drag and drop
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  // Handle done for all manual users
  const handleDoneAllManualUsers = handleFormSubmit((data) => {
    const newUsers = [];
    pendingUsers.forEach((user, index) => {
      const name = data[`name_${user.id}`];
      const email = data[`email_${user.id}`];
      const userClass = data[`class_${user.id}`];
      
      if (name && email && userClass) {
        newUsers.push({
          id: user.id,
          name,
          email,
          class: userClass
        });
      }
    });
    
    const duplicates = checkDuplicateEmails(newUsers);
    if (duplicates.length > 0) {
      setDuplicateEmails(duplicates);
    } else {
      setDuplicateEmails([]);
      setManualUsers([...manualUsers, ...newUsers]);
      setPendingUsers([{ id: Date.now() }]);
      reset();
    }
  });

  // Delete user
  const deleteUser = (id, type) => {
    if (type === 'csv') {
      setCsvData(csvData.filter(user => user.id !== id));
    } else {
      setManualUsers(manualUsers.filter(user => user.id !== id));
    }
    // Recheck duplicates after deletion
    const remainingUsers = [...csvData, ...manualUsers].filter(user => user.id !== id);
    setDuplicateEmails(checkDuplicateEmails(remainingUsers, []));
  };

  // Submit all users
  const handleSubmit = async() => {
    const allUsers = [...csvData, ...manualUsers];
    if (duplicateEmails.length !== 0) {
      return
    }
    if(!teacherId){
      toast.error("credientials are missing login again")
      return
    }
     try {
      const response = await addStudent(allUsers,teacherId);
      
      if(response){
        toast.success("student added successfully");
        onSuccess(response)
        onClose()
      }
     } catch (error) {
      console.error("Error occured while adding student",error)
     }
  };

  const allUsers = [...csvData, ...manualUsers];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Add Students</h2>
              <p className="text-sm text-gray-600">Upload CSV or add students manually</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg m-6 mb-4 flex-shrink-0">
            <button
              onClick={() => setActiveTab('csv')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
                activeTab === 'csv'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <FileText className="w-4 h-4 inline mr-2" />
              CSV Upload
            </button>
            <button
              onClick={() => setActiveTab('manual')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
                activeTab === 'manual'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Plus className="w-4 h-4 inline mr-2" />
              Manual Entry
            </button>
          </div>

          {/* Content Area - Scrollable */}
          <div className="flex-1 overflow-y-auto px-6 pb-4">
            {/* Duplicate Email Error */}
            {duplicateEmails.length > 0 && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-700">Duplicate emails detected:</p>
                  <ul className="list-disc list-inside text-sm text-red-600">
                    {duplicateEmails.map((email, index) => (
                      <li key={index}>{email}</li>
                    ))}
                  </ul>
                  <p className="text-sm text-red-600 mt-1">Please remove or modify duplicate emails before proceeding.</p>
                </div>
              </div>
            )}

            {/* CSV Upload Tab */}
            {activeTab === 'csv' && (
              <div className="space-y-6">
                <div
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                    dragActive
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Upload CSV File
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Drag and drop your CSV file here, or click to browse
                  </p>
                  <p className="text-sm text-gray-400 mb-4">
                    CSV should contain columns: name, email, class
                  </p>
                  <input
                    type="file"
                    accept=".csv"
                    ref={fileInputRef}
                    onChange={(e) => handleFileUpload(e.target.files[0])}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Choose File
                  </button>
                  {csvFile && (
                    <div className="mt-4 p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center justify-center gap-2 text-green-700">
                        <CheckCircle className="w-4 h-4" />
                        <span className="font-medium">{csvFile.name}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Manual Entry Tab */}
            {activeTab === 'manual' && (
              <form onSubmit={handleDoneAllManualUsers} className="space-y-6">
                {/* User Input Forms */}
                <div className="space-y-6">
                  {pendingUsers.map((user, index) => (
                    <div key={user.id} className="p-6 border border-gray-200 rounded-xl bg-white shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium text-gray-800">Student {index + 1} Information</h4>
                        {pendingUsers.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              setPendingUsers(pendingUsers.filter((_, i) => i !== index));
                            }}
                            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <InputField
                          control={control}
                          name={`name_${user.id}`}
                          label="Full Name"
                          type="text"
                          placeholder="Enter full name"
                          required={true}
                          icon={<User className="w-4 h-4" />}
                        />
                        <InputField
                          control={control}
                          name={`email_${user.id}`}
                          label="Email Address"
                          type="email"
                          placeholder="Enter email address"
                          required={true}
                          icon={<Mail className="w-4 h-4" />}
                          error={duplicateEmails.includes(getValues(`email_${user.id}`)) ? 'This email is already in use' : null}
                        />
                        <InputField
                          control={control}
                          name={`class_${user.id}`}
                          label="Class"
                          type="text"
                          placeholder="Enter class"
                          required={true}
                          icon={<GraduationCap className="w-4 h-4" />}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Done Button */}
                <div className="flex justify-center">
                  <button
                    type="submit"
                    className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Done - Add All Students
                  </button>
                </div>
              </form>
            )}

            {/* Users Preview */}
            {allUsers.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Added Students ({allUsers.length})
                </h3>
                <div className="bg-gray-50 rounded-xl overflow-hidden">
                  <div className="grid grid-cols-4 gap-4 p-4 bg-gray-100 font-medium text-gray-700 text-sm">
                    <div>Name</div>
                    <div>Email</div>
                    <div>Class</div>
                    <div>Action</div>
                  </div>
                  <div className="divide-y divide-gray-200 max-h-60 overflow-y-auto">
                    {csvData.map((user) => (
                      <UserRow
                        key={user.id}
                        user={user}
                        onDelete={() => deleteUser(user.id, 'csv')}
                        source="CSV"
                      />
                    ))}
                    {manualUsers.map((user) => (
                      <UserRow
                        key={user.id}
                        user={user}
                        onDelete={() => deleteUser(user.id, 'manual')}
                        source="Manual"
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <div className="text-sm text-gray-600">
            {allUsers.length} user{allUsers.length !== 1 ? 's' : ''} ready to add
          </div>
          <div className="flex gap-3">
            <button
            disabled={loading}
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={allUsers.length === 0 || duplicateEmails.length > 0 || loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Add {allUsers.length} Student{allUsers.length !== 1 ? 's' : ''}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// User Row Component
const UserRow = ({ user, onDelete, source }) => (
  <div className="grid grid-cols-4 gap-4 p-4 hover:bg-white transition-colors">
    <div className="font-medium text-gray-800">{user.name}</div>
    <div className="text-gray-600">{user.email}</div>
    <div className="text-gray-600">{user.class}</div>
    <div className="flex items-center gap-2">
      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
        {source}
      </span>
      <button
        onClick={onDelete}
        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  </div>
);
export default AddStudents;