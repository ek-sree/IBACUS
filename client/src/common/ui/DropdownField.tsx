import { useState, useRef, useEffect, useCallback } from "react";
import {
  ChevronDown,
  Search,
  X,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import {
  type Control,
  Controller,
  type FieldValues,
  type Path,
  type FieldError,
} from "react-hook-form";

interface Option {
  value: string | number | object;
  label: string;
  disabled?: boolean;
}

interface DropdownFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  options: Option[];
  required?: boolean;
  placeholder?: string;
  isMulti?: boolean;
  searchable?: boolean;
  leftIcon?: React.ReactNode;
  isLoading?: boolean;
  onFocus?: () => void;
  onChange?: (value: any) => void;
  className?: string;
  maxSelections?: number;
  error?: FieldError;
  rules?: any;
}

const DropdownField = <T extends FieldValues>({
  control,
  name,
  label,
  options,
  required = false,
  placeholder = "Select",
  isMulti = false,
  searchable = true,
  leftIcon,
  isLoading = false,
  onFocus,
  onChange: parentOnChange,
  className = "",
  maxSelections,
  error: externalError,
  rules,
}: DropdownFieldProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = useCallback(() => {
    if (!searchTerm) return options;
    return options.filter((option) =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [options, searchTerm]);

  const isValueEqual = (value1: any, value2: any) => {
    if (typeof value1 === "object" && typeof value2 === "object") {
      return JSON.stringify(value1) === JSON.stringify(value2);
    }
    return value1 === value2;
  };

  return (
    <Controller
      control={control}
      name={name}
      rules={{
        required: required ? `${label} is required` : false,
        ...rules,
      }}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const selectedValues = isMulti
          ? Array.isArray(value)
            ? value
            : []
          : value
            ? [value]
            : [];
        const selectedOptions = options.filter((option) =>
          selectedValues.some((selectedValue) =>
            isValueEqual(selectedValue, option.value)
          )
        );

        // Use external error if provided, otherwise use field error
        const displayError = externalError || error;

        return (
          <div className={`relative ${className}`} ref={dropdownRef}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>

            <div
              onClick={() => {
                if (!isLoading) {
                  setIsOpen(!isOpen);
                  setSearchTerm("");
                  onFocus?.();
                }
              }}
              className={`
                flex items-center justify-between w-full px-3 py-2 border rounded-lg cursor-pointer
                ${isLoading ? "bg-gray-50 cursor-not-allowed opacity-70" : "bg-white"}
                ${displayError ? "border-red-300 bg-red-50" : isOpen ? "border-blue-500 ring-1 ring-blue-500" : "border-gray-300"}
                ${leftIcon ? "pl-10" : ""}
              `}
            >
              {leftIcon && (
                <div className="absolute left-3 text-gray-400">{leftIcon}</div>
              )}

              <div className="flex-1 flex flex-wrap gap-1 overflow-hidden">
                {isLoading ? (
                  <span className="text-gray-400">Loading...</span>
                ) : selectedOptions.length > 0 ? (
                  isMulti ? (
                    selectedOptions.map((option, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-xs"
                      >
                        {option.label}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const newValues = selectedValues.filter(
                              (v) => !isValueEqual(v, option.value)
                            );
                            onChange(newValues);
                            parentOnChange?.(newValues);
                          }}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-900">
                      {selectedOptions[0]?.label}
                    </span>
                  )
                ) : (
                  <span className="text-gray-400">{placeholder}</span>
                )}
              </div>

              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400 ml-2" />
              ) : (
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
              )}
            </div>

            {displayError && (
              <div className="flex items-center gap-1 text-red-600 text-xs mt-1">
                <AlertCircle className="w-4 h-4" />
                <span>{displayError.message}</span>
              </div>
            )}

            {isOpen && (
              <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-hidden">
                {searchable && (
                  <div className="p-2 border-b border-gray-200">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        autoFocus
                      />
                      {searchTerm && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSearchTerm("");
                          }}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                )}
                <div className="max-h-80 overflow-y-auto">
                  {filteredOptions().length === 0 ? (
                    <div className="px-4 py-3 text-gray-500 text-center text-sm">
                      No options found
                    </div>
                  ) : (
                    filteredOptions().map((option) => {
                      const isSelected = selectedValues.some((selectedValue) =>
                        isValueEqual(selectedValue, option.value)
                      );
                      const isDisabled =
                        option.disabled ||
                        (maxSelections && isMulti && selectedValues.length >= maxSelections && !isSelected);

                      return (
                        <div
                          key={option.label}
                          onClick={() => {
                            if (!isDisabled) {
                              if (isMulti) {
                                const newValues = isSelected
                                  ? selectedValues.filter((v) => !isValueEqual(v, option.value))
                                  : [...selectedValues, option.value];
                                onChange(newValues);
                                parentOnChange?.(newValues);
                              } else {
                                onChange(option.value);
                                parentOnChange?.(option.value);
                                setIsOpen(false);
                              }
                            }
                          }}
                          className={`
                            px-4 py-3 cursor-pointer transition-colors duration-150 flex items-center justify-between
                            ${isDisabled ? "text-gray-400 cursor-not-allowed" : "hover:bg-blue-50"}
                            ${isSelected ? "bg-blue-50" : ""}
                          `}
                        >
                          <span className={`text-sm ${isSelected ? "font-medium text-blue-600" : "text-gray-700"}`}>
                            {option.label}
                          </span>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                        </div>
                      );
                    })
                  )}
                </div>

                {isMulti && (
                  <div className="p-3 border-t border-gray-200 bg-gray-50">
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      Done ({selectedValues.length} selected)
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      }}
    />
  );
};

export default DropdownField;