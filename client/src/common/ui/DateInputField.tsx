import React from "react";
import { Controller, type Control, type FieldError, type RegisterOptions } from "react-hook-form";

interface DateInputFieldProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  name: string;
  label: string;
  error?: FieldError;
  rules?: Omit<RegisterOptions, 'valueAsNumber' | 'valueAsDate' | 'setValueAs'>;
  className?: string;
  required?: boolean;
}

const DateInputField: React.FC<DateInputFieldProps> = ({
  control,
  name,
  label,
  error,
  rules,
  ...props
}) => {
  return (
    <div className="flex flex-col space-y-1">
      <label className="font-medium text-gray-700">{label}</label>
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field }) => (
          <input
            {...field}
            {...props}
            type="date"
            className={`rounded-lg border p-2 ${
              error ? "border-red-500" : "border-gray-300"
            }`}
            min={new Date().toISOString().split("T")[0]}
          />
        )}
      />
      {error && <span className="text-red-500 text-sm">{error.message}</span>}
    </div>
  );
};

export default DateInputField;