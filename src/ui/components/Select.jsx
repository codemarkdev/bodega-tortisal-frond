import React from 'react';
import PropTypes from 'prop-types';

export const Select = ({
  options,
  value,
  onChange,
  label,
  id,
  disabled,
  required,
  className = '',
  placeholder,
  error,
  helpText,
}) => {
  const handleChange = (value) => {
    onChange({
      target: {
        name: id, // Usamos el id como nombre del campo
        value,
      },
    });
  };

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label 
          htmlFor={id} 
          className={`block text-sm font-medium mb-1 ${
            error ? 'text-red-600' : 'text-gray-700'
          }`}
        >
          {label}
          {required && <span className="text-red-600 ml-1">*</span>}
        </label>
      )}
      
      <select
        id={id}
        value={value || ''} // Aseguramos que el valor sea una cadena vacía si es null o undefined
        onChange={(e) => handleChange(e.target.value)} // Ajustamos el evento
        disabled={disabled}
        className={`block w-full px-3 py-2 border ${
          error 
            ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
            : 'border-gray-300 focus:ring-tortisal-200 focus:border-tortisal-200'
        } rounded-md shadow-sm focus:outline-none focus:ring-2 ${
          disabled ? 'bg-gray-100 cursor-not-allowed opacity-70' : 'bg-white'
        }`}
      >
        {placeholder && (
          <option value="" disabled className="text-gray-400">
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option 
            key={option.value} 
            value={option.value}
            className="text-gray-900"
          >
            {option.label}
          </option>
        ))}
      </select>

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      
      {helpText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helpText}</p>
      )}
    </div>
  );
};

Select.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,

  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
  id: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  className: PropTypes.string,
  placeholder: PropTypes.string,
  error: PropTypes.string,
  helpText: PropTypes.string,
};

Select.defaultProps = {
  value: '',
  disabled: false,
  required: false,
};

