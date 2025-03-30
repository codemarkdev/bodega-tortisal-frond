import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Plus, Trash, Edit } from '../icons';
import { Button } from './Button';

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
  const [confirmationState, setConfirmationState] = useState({
    show: false,
    item: null,
    action: null
  });

  // Pagination calculations
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = data.slice(startIndex, endIndex);

  const handlePrevious = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const handleNext = () => currentPage < totalPages && setCurrentPage(currentPage + 1);

  const handleActionClick = (item, action) => {
    if (action.icon === Trash) {
   
      setConfirmationState({
        show: true,
        item,
        action
      });
    } else {
  
      action.onClick(item);
    }
  };

  const handleConfirm = () => {
    confirmationState.action.onClick(confirmationState.item);
    setConfirmationState({ show: false, item: null, action: null });
  };

  const handleCancel = () => {
    setConfirmationState({ show: false, item: null, action: null });
  };

  return (
    <div className="space-y-4">
      {/* Popup de Confirmación Minimalista */}
      {confirmationState.show && (
        <div className="fixed inset-0 bg-black/90 bg-opacity-30 flex items-center justify-center p-4 z-50 h-screen">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Confirmar eliminación</h3>
            <p className="text-gray-600 mb-6">¿Estás seguro de que deseas eliminar este elemento?</p>
            <div className="flex justify-end space-x-3">
              <Button variant="ghost" onClick={handleCancel}>
                Cancelar
              </Button>
              <Button variant="danger" onClick={handleConfirm}>
                Confirmar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Resto del componente Table... */}
      <div className="flex items-center justify-between">
        {title && <h2 className="text-xl font-light text-gray-800">{title}</h2>}
        {onAddClick && (
          <Button icon={Plus} onClick={onAddClick}>
            {addButtonText}
          </Button>
        )}
      </div>

      {/* Tabla */}
      <div className="overflow-hidden border-b border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          {/* Cabeceras... */}
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
                  Acciones
                </th>
              )}
            </tr>
          </thead>
          
          {/* Cuerpo de la tabla */}
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.length > 0 ? (
              paginatedData.map((item, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-gray-50">
                  {columns.map((column) => (
                    <td key={`${column.key}-${rowIndex}`} className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                      {column.render ? column.render(item) : item[column.key]}
                    </td>
                  ))}
                  {actions?.length > 0 && (
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm">
                      <div className="flex flex-wrap justify-end gap-2">
                        {actions.map((action, i) => (
                          <Button
                            key={i}
                            variant="ghost"
                            size="small"
                            icon={action.icon}
                            onClick={() => handleActionClick(item, action)}
                            className={`whitespace-nowrap ${action.className || ''}`}
                          >
                            {action.label}
                          </Button>
                        ))}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td 
                  colSpan={columns.length + (actions?.length > 0 ? 1 : 0)} 
                  className="px-4 py-6 text-center text-sm text-gray-500"
                >
                  No hay datos disponibles
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {data.length > 0 && data.length > itemsPerPage && (
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div>
            Mostrando <span className="font-medium">{startIndex + 1}</span> -{' '}
            <span className="font-medium">{Math.min(endIndex, data.length)}</span> de{' '}
            <span className="font-medium">{data.length}</span> registros
          </div>
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="small"
              onClick={handlePrevious}
              disabled={currentPage === 1}
            >
              Anterior
            </Button>
            <Button
              variant="ghost"
              size="small"
              onClick={handleNext}
              disabled={currentPage === totalPages}
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

// Prop Types (igual que antes)
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