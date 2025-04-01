import React from "react";
import PropTypes from "prop-types";

export const FloatingAlert = ({ 
  message = 'Ingresar un msg.', 
  type = "info", 
  onClose,
  position = "top-right",
  duration = 5000,
  showIcon = true
}) => {
  const typeStyles = {
    info: "bg-blue-50 text-blue-800 border-blue-300",
    success: "bg-green-50 text-green-800 border-green-300",
    warning: "bg-yellow-50 text-yellow-800 border-yellow-300",
    error: "bg-red-50 text-red-800 border-red-300",
  };

  const positionStyles = {
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "top-center": "top-4 left-1/2 transform -translate-x-1/2",
    "bottom-center": "bottom-4 left-1/2 transform -translate-x-1/2"
  };



  React.useEffect(() => {
    if (duration && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <div
      className={`fixed z-50 p-4 rounded-lg border ${typeStyles[type]} ${positionStyles[position]} flex items-center shadow-lg animate-fade-in`}
      role="alert"
    >
      {showIcon && <span className="mr-2 text-lg"></span>}
      <span className="pr-2">{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-2 text-current hover:opacity-70 text-lg"
          aria-label="Cerrar"
        >
          &times;
        </button>
      )}
    </div>
  );
};

FloatingAlert.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["info", "success", "warning", "error"]),
  onClose: PropTypes.func,
  position: PropTypes.oneOf([
    "top-right", 
    "top-left", 
    "bottom-right", 
    "bottom-left",
    "top-center",
    "bottom-center"
  ]),
  duration: PropTypes.number,
  showIcon: PropTypes.bool
};