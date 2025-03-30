import React from "react";
import { Link } from "react-router-dom";

export const Breadcrumb = ({ items }) => {
  return (
    <nav className="flex items-center text-sm text-gray-600 mb-4">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <span className="mx-2 text-gray-400 select-none">/</span>
          )}
          {item.href ? (
            <Link
              to={item.href}
              className="hover:text-gray-900 transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 font-medium">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

Breadcrumb.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      href: PropTypes.string,
    })
  ).isRequired,
};