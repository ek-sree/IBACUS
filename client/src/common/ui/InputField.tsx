import React from "react";
import { useController, type Control, type FieldError } from "react-hook-form";

interface InputFieldProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  name: string;
  label?: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  icon?: React.ReactNode;
  error?: FieldError | string | null;
  className?: string;
  rows?: number;
  multiline?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rules?: Record<string, any>;
}

const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

const InputField: React.FC<InputFieldProps> = ({
  control,
  name,
  label,
  placeholder = "",
  type = "text",
  required = false,
  icon,
  error,
  className = "",
  rows,
  multiline = false,
  rules = {},
}) => {
  const {
    field,
    fieldState: { error: fieldError },
  } = useController({
    name,
    control,
    rules: {
      ...rules,
      required: required ? `${label} is required` : undefined,
      validate: (value) => {
        // Email-specific validation
        if (type === "email") {
          if (value == null || value === "") return `${label} is required`;
          if (!isValidEmail(String(value))) return "Please enter a valid email";
        }

        // Generic required validation
        if (required) {
          if (typeof value === "string" && value.trim() === "") {
            return `${label} is required`;
          }
          if (value == null || value === "") {
            return `${label} is required`;
          }
        }
        return true;
      },
    },
  });

  return (
    <div className={`flex flex-col space-y-1 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && <div className="absolute left-3 text-gray-400">{icon}</div>}
        {multiline ? (
          <textarea
            {...field}
            placeholder={placeholder}
            rows={rows || 4}
            className={`
              w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              ${icon ? "pl-10" : ""}
              ${fieldError || error ? "border-red-500" : "border-gray-300"}
            `}
          />
        ) : (
          <input
            {...field}
            placeholder={placeholder}
            type={type}
            className={`
              w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              ${icon ? "pl-10" : ""}
              ${fieldError || error ? "border-red-500" : "border-gray-300"}
            `}
          />
        )}
      </div>
      {(fieldError || error) && (
  <span className="text-red-500 text-xs">
    {fieldError?.message || (typeof error === 'string' ? error : error?.message)}
  </span>
)}
    </div>
  );
};

export default InputField;
