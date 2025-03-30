import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { ChevronRight } from "../icons";


export const Breadcrumb = ({ items }) => {
  return (
    <nav className="flex items-center space-x-1 text-sm text-gray-500">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <ChevronRight/>
          )}
          {item.href ? (
            <Link
              to={item.href}
              className="hover:text-gray-700 transition-colors duration-150"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-700 font-normal">{item.label}</span>
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