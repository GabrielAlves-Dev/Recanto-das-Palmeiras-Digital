import React from 'react';
interface InputProps {
  label?: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  id?: string;
  name?: string;
  required?: boolean;
  fullWidth?: boolean;
}
const Input: React.FC<InputProps> = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  id,
  name,
  required = false,
  fullWidth = true
}) => {
  return <div className={`mb-4 ${fullWidth ? 'w-full' : ''}`}>
      {label && <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>}
      <input type={type} id={id} name={name} placeholder={placeholder} value={value} onChange={onChange} required={required} className={`
          px-3 py-2 bg-white border ${error ? 'border-red-500' : 'border-gray-300'} 
          rounded-md shadow-sm placeholder-gray-400
          focus:outline-none focus:ring-emerald-500 focus:border-emerald-500
          block w-full text-sm
        `} />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>;
};
export default Input;