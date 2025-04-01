
import React from "react";
import PropTypes from "prop-types";

export const Alert = ({ message = 'Ingresar un msg.', type = "info", onClose }) => {
  const typeStyles = {
    info: "bg-blue-50 text-blue-800",
    success: "bg-green-50 text-green-800",
    warning: "bg-yellow-50 text-yellow-800",
    error: "bg-red-50 text-red-800",
  };

  return (
    <div
      className={`p-4 mb-4 rounded-lg ${typeStyles[type]} flex justify-between items-center`}
      role="alert"
    >
      <span>{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-2 text-current hover:opacity-70"
          aria-label="Cerrar"
        >
          ×
        </button>
      )}
    </div>
  );
};

Alert.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["info", "success", "warning", "error"]),
  onClose: PropTypes.func,
};
