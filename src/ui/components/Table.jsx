import React, { useState } from 'react';
import PropTypes from 'prop-types';


export const Table = ({
    title,
    columns,
    data,
    actions,
    onAddClick,
    addButtonText = 'Add',
    itemsPerPage = 5
}) => {
    const [currentPage, setCurrentPage] = useState(1);

    // Pagination calculations
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = data.slice(startIndex, endIndex);

    const handlePrevious = () => currentPage > 1 && setCurrentPage(currentPage - 1);
    const handleNext = () => currentPage < totalPages && setCurrentPage(currentPage + 1);

    return (
        <div className="space-y-4">
      
            <div className="flex items-center justify-between">
                {title && <h2 className="text-xl font-light text-gray-800">{title}</h2>}
                {onAddClick && (
                    <button
                        onClick={onAddClick}
                        className="px-3 py-1.5 text-sm text-white bg-tortisal-200 hover:bg-tortisal-100 rounded"
                    >
                        {addButtonText}
                    </button>
                )}
            </div>

            {/* Table */}
            <div className="overflow-hidden border-b border-gray-200 rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr>
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    {column.title}
                                </th>
                            ))}
                            {actions?.length > 0 && (
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {paginatedData.map((item, rowIndex) => (
                            <tr key={rowIndex} className="hover:bg-gray-50">
                                {columns.map((column) => (
                                    <td key={`${column.key}-${rowIndex}`} className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                                        {column.render ? column.render(item) : item[column.key]}
                                    </td>
                                ))}
                                {actions?.length > 0 && (
                                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm">
                                        <div className="space-x-1">
                                            {actions.map((action, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => action.onClick(item)}
                                                    className={`text-gray-500 hover:text-gray-700 ${action.className || ''}`}
                                                >
                                                    {action.icon ? <action.icon className="h-4 w-4" /> : action.label}
                                                </button>
                                            ))}
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {data.length > itemsPerPage && (
                <div className="flex items-center justify-between text-sm text-gray-600">
                    <div>
                        Mostrando <span className="font-medium">{startIndex + 1}</span> -{' '}
                        <span className="font-medium">{Math.min(endIndex, data.length)}</span> de un total de{' '}
                        <span className="font-medium">{data.length}</span> registros
                    </div>
                    <div className="flex space-x-1">
                        <button
                            onClick={handlePrevious}
                            disabled={currentPage === 1}
                            className="px-2.5 py-1.5 rounded hover:bg-gray-100 disabled:opacity-50"
                        >
                            Anterior
                        </button>
                        <button
                            onClick={handleNext}
                            disabled={currentPage === totalPages}
                            className="px-2.5 py-1.5 rounded hover:bg-gray-100 disabled:opacity-50"
                        >
                            Siguiente
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

Table.propTypes = {
    title: PropTypes.string,
    columns: PropTypes.arrayOf(
        PropTypes.shape({
            key: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
            render: PropTypes.func,
        })
    ).isRequired,
    data: PropTypes.array.isRequired,
    actions: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string,
            icon: PropTypes.elementType,
            className: PropTypes.string,
            onClick: PropTypes.func.isRequired,
        })
    ),
    onAddClick: PropTypes.func,
    addButtonText: PropTypes.string,
    itemsPerPage: PropTypes.number,
};