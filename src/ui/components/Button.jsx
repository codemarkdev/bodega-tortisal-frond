import React from 'react';
import PropTypes from 'prop-types';

export const Button = ({ 
  children, 
  icon: Icon, 
  variant = 'primary',
  size = 'medium',
  disabled = false,
  onClick,
  className = '',
  ...props 
}) => {
  // Estilos base
  const baseStyles = 'rounded-md font-medium transition-all duration-200 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  // Variantes de color
  const variants = {
    primary: 'bg-tortisal-200 text-white hover:bg-tortisal-100 focus:ring-gray-500',
    secondary: 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-300',
  };
  
  // Tamaños
  const sizes = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg',
  };
  
  // Estado deshabilitado
  const disabledStyles = 'opacity-50 cursor-not-allowed';

  const handleClick = (e) => {
    if (!disabled && onClick) {
      onClick(e);
    }
  };
  
  return (
    <button
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${disabled ? disabledStyles : ''}
        ${className}
      `}
      disabled={disabled}
      onClick={handleClick}
      {...props}
    >
      {Icon && <Icon className={`${size === 'small' ? 'h-4 w-4' : 'h-5 w-5'}`} />}
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  icon: PropTypes.elementType,
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger', 'ghost']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  className: PropTypes.string,
};