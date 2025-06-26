import { Controller, type Control, type FieldError, type Merge } from "react-hook-form";
import { X, Plus } from "lucide-react";

interface ImageInputFieldProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  name: string;
  label: string;
  error?: FieldError | string | Merge<FieldError, (FieldError | undefined)[]> | undefined;
  multiple?: boolean;
  acceptedTypes?: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rules?: any; 
}


const ImageInputField = ({ control, name, label, error, multiple = false, acceptedTypes }:ImageInputFieldProps) => {
  return (
    <div className="flex flex-col space-y-3">
      <label className="font-semibold text-gray-800 text-sm uppercase tracking-wide">{label}</label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          const handleFiles = (e) => {
            const files = Array.from(e.target.files);
            const newFiles = files.map((f) => ({
              id: Math.random().toString(36).substring(2, 9),
              file: f,
              preview:
                f.type.startsWith("image/")
                  ? URL.createObjectURL(f)
                  : null,
            }));

            field.onChange([...(field.value || []), ...newFiles]);
          };
          
          const removeFile = (id) => {
            const updated = (field.value || []).filter((f) => f.id !== id);
            field.onChange(updated);
          };
          
          return (
            <div className="space-y-4">
              {/* Stylish Add Button */}
              <div className="relative">
                <input
                  type="file"
                  multiple={multiple}
                  accept={acceptedTypes?.join(", ")}
                  onChange={handleFiles}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  id={`file-input-${name}`}
                />
                <label
                  htmlFor={`file-input-${name}`}
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gradient-to-br from-gray-50 to-gray-100 hover:from-blue-50 hover:to-blue-100 hover:border-blue-400 transition-all duration-300 group"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <div className="w-12 h-12 mb-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Plus className="w-6 h-6 text-white" />
                    </div>
                    <p className="mb-1 text-sm text-gray-600 font-medium group-hover:text-blue-600 transition-colors">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      {acceptedTypes?.includes("image/*") ? "Images" : "Files"} 
                      {multiple ? " (Multiple files allowed)" : ""}
                    </p>
                  </div>
                </label>
              </div>

              {/* File Preview Grid - Original Style */}
              {field.value && field.value.length > 0 && (
                <div className="grid grid-cols-2 gap-4 mt-2">
                  {field.value.map((item) => (
                    <div
                      key={item.id}
                      className="relative group rounded-lg overflow-hidden border border-gray-300"
                    >
                      {item.preview ? (
                        <img
                          src={item.preview}
                          alt="preview"
                          className="object-cover h-32 w-full"
                        />
                      ) : (
                        <div className="h-32 flex items-center justify-center bg-gray-100">
                          <span className="text-gray-600">PDF</span>
                        </div>
                      )}
                      
                      {/* Enhanced Delete Button */}
                      <button
                        type="button"
                        onClick={() => removeFile(item.id)}
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500 text-white hover:bg-red-600 transform hover:scale-110 transition-all duration-200 flex items-center justify-center shadow-lg"
                        title="Remove file"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        }}
      />
      {error && (
        <div className="flex items-center space-x-1 mt-1">
          <div className="w-1 h-1 bg-red-500 rounded-full"></div>
          <span className="text-red-500 text-sm font-medium">{error.message}</span>
        </div>
      )}
    </div>
  );
};

export default ImageInputField;