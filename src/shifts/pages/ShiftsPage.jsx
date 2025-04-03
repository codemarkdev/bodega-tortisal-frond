import { useState, useEffect } from "react";
import { columnsShifts } from "../../../confiTable";
import { Box, Breadcrumb, Calendar, Edit, Eye, History, Shift, Table, Trash } from "../../ui";
import apiRequest from "../../helpers/ApiRequest";
import { useNavigate } from "react-router-dom";
import { FloatingAlert } from "../../ui/components/FlotingAlert";
import { DatePicker, Button, Panel, Message, Modal, Input, InputNumber, SelectPicker, AutoComplete } from 'rsuite';
import { useRef } from "react";

export const ShiftsPage = () => {
  const [listShifts, setListShifts] = useState({
    data: [],
    dataPage: [],
    isLoading: false,
    alert: { msg: "", show: false, type: "error" },
    selectedDate: null,
  });

  const [modals, setModals] = useState({
    showToolModal: false,
    showAssignToolModal: false,
  });

  const [currentShift, setCurrentShift] = useState({ idEmployee: null, shiftId: null });
  const [pagination, setPagination] = useState({ currentPage: 1, totalItems: 0, itemsPerPage: 10 });
  const autoCompleteRef = useRef(null);
  const [tools, setTools] = useState({
    toAssign: [],
    available: [],
    search: "",
    assignLoading: false,
    alert: { msg: "", show: false, type: "error" },
  });

  const [shift, setShift] = useState({ id: null, employeeId: null });
  const navigate = useNavigate();

  const formatDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const getShifts = async (date = null, page = 1) => {
    setListShifts((prev) => ({ ...prev, isLoading: true }));
    let path = `shifts?page=${page}&limit=${pagination.itemsPerPage}${date ? `&date=${formatDate(date)}` : ''}`;
    try {
      const { status, data } = await apiRequest({ method: 'GET', path });
      if (status === 200) {
        setListShifts((prev) => ({
          ...prev,
          data: data.data ?? [],
          dataPage: data ?? [],
          isLoading: false,
          alert: { ...prev.alert, show: false },
        }));
        setPagination((prev) => ({ ...prev, totalItems: data.total ?? 0, currentPage: page }));
      } else {
        setListShifts((prev) => ({
          ...prev,
          isLoading: false,
          alert: { msg: data?.message || "Error al obtener los turnos", show: true, type: 'error' },
        }));
      }
    } catch {
      setListShifts((prev) => ({
        ...prev,
        isLoading: false,
        alert: { msg: "Error de conexión", show: true, type: 'error' },
      }));
    }
  };

  useEffect(() => { getShifts(); }, []);

  const handleDateChange = (date) => {
    setListShifts((prev) => ({ ...prev, selectedDate: date }));
    getShifts(date);
  };

  const handleClearDate = () => {
    setListShifts((prev) => ({ ...prev, selectedDate: null }));
    getShifts();
  };

  const handleCheckOutTime = async (shiftId, idEmployee) => {
    setListShifts((prev) => ({ ...prev, isLoading: true }));
    setCurrentShift({ idEmployee, shiftId });
    try {
      const { status, data } = await apiRequest({ method: "GET", path: `tools-issued/employee/${idEmployee}/shift/${shiftId}` });
      if (status === 200 && data.tools.some((tool) => tool.issued > (tool.returned ?? 0))) {
        setModals((prev) => ({ ...prev, showToolModal: true }));
        return;
      }
      await proceedWithCheckOut(false, idEmployee, shiftId);
    } catch {
      setListShifts((prev) => ({
        ...prev,
        alert: { msg: "Error de conexión", show: true, type: "error" },
        isLoading: false,
      }));
    }
  };

  const proceedWithCheckOut = async (returnTools = false, idE, idS) => {

    try {
      if (returnTools) {
        const { status, data } = await apiRequest({ method: "GET", path: `tools-issued/employee/${idE}/shift/${idS}` });
        if (status === 200) {
          const unreturnedTools = data.tools.filter((tool) => tool.issued > (tool.returned ?? 0));
          await Promise.all(
            unreturnedTools.map((tool) =>
              apiRequest({
                method: "POST",
                path: `tools-issued/return/${idS}`,
                data: { tools: [{ productId: tool.product.id, quantityReturned: 0 }] },
              })
            )
          );
        }
      }
      const { status, data } = await apiRequest({ method: "POST", path: `shifts/employee/${idE}/close` });
      setListShifts((prev) => ({
        ...prev,
        alert: { msg: status === 201 ? "Registrada correctamente" : data?.message || "Error al registrar", show: true, type: status === 201 ? "success" : "error" },
      }));
      if (status === 201) await getShifts(listShifts.selectedDate);
    } catch {
      setListShifts((prev) => ({
        ...prev,
        alert: { msg: "Error de conexión", show: true, type: "error" },
      }));
    } finally {
      setListShifts((prev) => ({ ...prev, isLoading: false }));
      setModals((prev) => ({ ...prev, showToolModal: false }));
    }
  };

  const handleDelete = async (shift) => {
    setListShifts((prev) => ({ ...prev, isLoading: true }));
    try {
      const { status } = await apiRequest({ method: 'DELETE', path: `shifts/${shift.id}` });
      if (status === 200) {
        setListShifts((prev) => ({
          ...prev,
          alert: { msg: "Turno eliminado correctamente", show: true, type: 'success' },
        }));
        await getShifts(listShifts.selectedDate);
      }
      else {
        setListShifts((prev) => ({
          ...prev,
          alert: { msg: "Las herramientas ya han sido asignadas al turno.", show: true, type: 'error' },
        }));

      }
    } catch {
      setListShifts((prev) => ({
        ...prev,
        alert: { msg: "Error al eliminar el turno", show: true, type: 'error' },
      }));
    } finally {
      setListShifts((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const handlePageChange = (page) => getShifts(listShifts.selectedDate, page);

  const fetchAvailableTools = async (searchTerm = "") => {
    try {
      setTools((prev) => ({ ...prev, search: searchTerm }));
      const { status, data } = await apiRequest({
        method: 'GET',
        path: `products/search?name=${searchTerm}`,
      });

      if (status === 200) {
        setTools((prev) => ({
          ...prev,
          available: data.map(tool => ({
            label: tool.name,
            value: tool.name,
            id: tool.id,
            stock: tool.quantity
          }))
        }));

      }
    } catch (error) {
      setListShifts(prev => ({
        ...prev,
        alert: {
          msg: "Error al buscar herramientas",
          show: true,
          type: 'error',
        },
      }));
    }
  };

  const handleAddTool = () => {
    const newTools = [...tools.toAssign, {
      toolId: null,
      quantity: 1,
      maxQuantity: 1
    }];

    setTools((prev) => ({ ...prev, toAssign: newTools }));
  };

  const handleRemoveTool = (index) => {
    setTools((prev) => ({ ...prev, toAssign: prev.toAssign.filter((_, i) => i !== index) }));
  };

  const handleToolChange = (index, field, value) => {
    setTools((prev) => {
      const updated = [...prev.toAssign];

      if (field === 'toolId') {
        const selectedTool = prev.available.find(t => t.value === value);
        updated[index].maxQuantity = selectedTool ? selectedTool.stock : 1;
        if (updated[index].quantity > updated[index].maxQuantity) {
          updated[index].quantity = updated[index].maxQuantity;
        }
        updated[index][field] = value;
      } else {
        updated[index][field] = value;
      }
      return { ...prev, toAssign: updated };
    });
  };


  const handleAssignTools = async () => {
    const emptyTool = tools.toAssign.some(tool => !tool.toolId);
    if (emptyTool) {
      setTools((prev) => ({
        ...prev,
        alert: {
          msg: "Por favor selecciona todas las herramientas",
          show: true,
          type: 'error',
        },
      }));
      setTimeout(() => {
        setTools((prev) => ({ ...prev, alert: { ...prev.alert, show: false } }));
      }, 3000);

      return;
    }

    const invalidQuantity = tools.toAssign.some(tool =>
      tool.quantity < 1 || tool.quantity > tool.maxQuantity
    );
    if (invalidQuantity) {
      setTools((prev) => ({
        ...prev,
        alert: {
          msg: "Las cantidades deben ser válidas (1 - disponible)",
          show: true,
          type: 'error',
        },
      }));

      setTimeout(() => {
        setTools((prev) => ({ ...prev, alert: { ...prev.alert, show: false } }));
      }, 3000);

      return;
    }

    setTools((prev) => ({ ...prev, assignLoading: true }));

    try {
      // Obtener herramientas ya asignadas al turno actual
      const { status: toolsStatus, data: toolsData } = await apiRequest({
        method: "GET",
        path: `tools-issued/employee/${shift.employeeId}/shift/${shift.id}`,
      });

      let alreadyIssuedProductIds = [];
      if (toolsStatus === 200) {
        alreadyIssuedProductIds = toolsData.tools.map(tool => tool.product.id);
      }

      // Filtrar herramientas que no están asignadas
      const toolsToSend = tools.toAssign.filter(tool =>
        !alreadyIssuedProductIds.includes(tool.toolId)
      );

      if (toolsToSend.length === 0) {
        setTools((prev) => ({
          ...prev,
          alert: {
            msg: "Todas las herramientas seleccionadas ya están asignadas",
            show: true,
            type: 'info',
          },
        }));

        setTimeout(() => {
          setTools((prev) => ({ ...prev, alert: { ...prev.alert, show: false } }));
        }, 3000);

        setTools((prev) => ({ ...prev, assignLoading: false }));
        return;
      }

      // Agrupar herramientas por productId y sumar cantidades
      const groupedAssignments = toolsToSend.reduce((acc, tool) => {
        const selectedTool = tools.available.find(t => t.value === tool.toolId); // Find tool by value
        const toolId = selectedTool ? selectedTool.id : null; // Use id instead of value
        if (!toolId) return acc;

        const existingTool = acc.find(t => t.productId === toolId);
        if (existingTool) {
          existingTool.quantity += Number(tool.quantity); // Convertir a número antes de sumar
        } else {
          acc.push({ productId: toolId, quantity: Number(tool.quantity) }); // Convertir a número
        }
        return acc;
      }, []);

      const { status, data } = await apiRequest({
        method: 'POST',
        path: `tools-issued/issue/${shift.id}`,
        data: {
          products: groupedAssignments, // Aquí se envía el id del producto
        }
      });

      if (status === 201) {
        setTools((prev) => ({
          ...prev,
          alert: {
            msg: "Herramientas asignadas correctamente",
            show: true,
            type: 'success',
          },
        }));
        setModals((prev) => ({ ...prev, showAssignToolModal: false }));
        setTools((prev) => ({ ...prev, toAssign: [] }));
      } else {
        setTools((prev) => ({
          ...prev,
          alert: {
            msg: data?.message || "Error al asignar herramientas",
            show: true,
            type: 'error',
          },
        }));
      }
    } catch (error) {
      setTools((prev) => ({
        ...prev,
        alert: {
          msg: "Error de conexión al asignar herramientas",
          show: true,
          type: 'error',
        },
      }));
    } finally {
      setTools((prev) => ({ ...prev, assignLoading: false }));
    }
  };
  const getToolName = (toolId) => {
    const tool = tools.available.find(t => t.id === toolId);
    return tool ? tool.label : 'Selecciona herramienta';
  };

  const actions = [
    { label: 'Eliminar turno', icon: Trash, onClick: handleDelete, disabled: listShifts.isLoading },
    { label: 'Mas detalles', icon: Eye, onClick: (shift) => navigate(`/shifts/${shift.id}/${shift.employee?.id}`), disabled: listShifts.isLoading },
    { label: 'Asignar herramientas', icon: Box, onClick: async (shift) => { await fetchAvailableTools(); setShift({ id: shift.id, employeeId: shift.employee.id }); setModals((prev) => ({ ...prev, showAssignToolModal: true })); }, disabled: listShifts.isLoading },
    { label: 'Cerrar turno', icon: Calendar, onClick: (shift) => handleCheckOutTime(shift.id, shift.employee.id), disabled: listShifts.isLoading },
    { label: "Historial", icon: History, onClick: (shift) => navigate(`/shifts/${shift.employee.id}`) },
  ];
  useEffect(() => {
    if (autoCompleteRef.current && modals.showAssignToolModal) {
      autoCompleteRef.current.focus();
    }
  }, [modals.showAssignToolModal]);

  return (
    <div className="flex flex-col px-4 py-4 space-y-4">
      <Breadcrumb items={[{ label: 'Turnos', href: '/shifts' }]} />

      <Panel header={<h3 className="text-lg font-semibold">Filtrar por fecha</h3>} collapsible bordered>
        <div className="flex items-center space-x-4">
          <DatePicker
            placeholder="Selecciona una fecha"
            format="dd-MM-yyyy"
            value={listShifts.selectedDate}
            onChange={handleDateChange}
            cleanable={false}
            className="w-48"
          />

          {listShifts.selectedDate && (
            <Button
              appearance="ghost"
              onClick={handleClearDate}
              disabled={listShifts.isLoading}
            >
              Limpiar filtro
            </Button>
          )}
        </div>
      </Panel>

      {listShifts.alert.show && (
        <FloatingAlert
          position="top-center"
          message={listShifts.alert.msg}
          type={listShifts.alert.type}
          onClose={() => {
            setListShifts(prev => ({
              ...prev,
              alert: {
                ...prev.alert,
                show: false
              }
            }));
          }}
          duration={3000}
        />
      )}

      <Table
        isLoading={listShifts.isLoading}
        title={`Gestión de Turnos ${listShifts.selectedDate ? `- ${formatDate(listShifts.selectedDate)}` : ''}`}
        columns={columnsShifts}
        data={listShifts.data}
        actions={actions}
        onAddClick={() => navigate('/shifts/add')}
        addButtonText="Nuevo turno"
        paginationProps={{
          itemsPerPage: pagination.itemsPerPage,
          totalItems: pagination.totalItems,
          currentPage: pagination.currentPage,
          onPageChange: handlePageChange,
        }}
        emptyMessage={listShifts.selectedDate
          ? "No hay turnos registrados para esta fecha"
          : "No hay turnos registrados"}
        rowClassName={(rowData, index) =>
          index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
        }
      />

      <Modal open={modals.showToolModal} onClose={() => setModals((prev) => ({ ...prev, showToolModal: false }))}>
        <Modal.Header>
          <Modal.Title>Herramientas no devueltas</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Existen herramientas no devueltas. ¿Desea continuar y devolverlas automáticamente con cantidad 0?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => {
            setModals((prev) => ({ ...prev, showToolModal: false }));
            setListShifts(prev => ({ ...prev, isLoading: false }));
          }} appearance="subtle">
            Cancelar
          </Button>
          <Button onClick={() => proceedWithCheckOut(true, currentShift.idEmployee, currentShift.shiftId)} appearance="primary">
            Continuar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal open={modals.showAssignToolModal} onClose={() => {
        if (!tools.assignLoading) {
          setModals((prev) => ({ ...prev, showAssignToolModal: false }));
          setTools({
            toAssign: [],
            available: [],
            search: "",
            assignLoading: false,
            alert: { msg: "", show: false, type: "error" },
          });
        }
      }} size="md">
        <Modal.Header>
          <Modal.Title>Asignar Herramientas</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            {tools.alert.show && (
              <Message
                type={tools.alert.type}
                className="mb-4"
                onClose={() => setTools((prev) => ({ ...prev, alert: { ...prev.alert, show: false } }))}
              >{tools.alert.msg}</Message>)}
            {tools.toAssign.map((tool, index) => (
              <div key={index} className="flex flex-col space-y-2 p-3 bg-gray-50 rounded">
                <div className="flex items-center space-x-3">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Herramienta {index + 1}
                    </label>
                    <SelectPicker
                      data={tools.available}
                      value={tool.toolId}
                      onChange={(value) => handleToolChange(index, 'toolId', value)}
                      placeholder="Seleccionar herramienta"
                      searchable
                      onSearch={fetchAvailableTools}
                      style={{ width: '100%' }}
                    />
                  </div>

                  <div className="w-24">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cantidad
                    </label>
                    <InputNumber
                      min={1}
                      max={tool.maxQuantity || 1}
                      value={tool.quantity}
                      onChange={(value) => handleToolChange(index, 'quantity', value)}
                      className="w-full"
                      disabled={!tool.toolId}
                    />
                  </div>

                  <Button
                    appearance="ghost"
                    color="red"
                    onClick={() => handleRemoveTool(index)}
                    disabled={tools.assignLoading}
                    className="self-end"
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </div>

                {tool.toolId && (
                  <div className="text-sm text-gray-600">
                    Seleccionado: <span className="font-medium">{getToolName(tool.toolId)}</span>
                  </div>
                )}
              </div>
            ))}

            <Button
              appearance="ghost"
              onClick={handleAddTool}
              disabled={tools.assignLoading || tools.toAssign.some(t => !t.toolId)}
              startIcon={<Edit />}
              block
            >
              Agregar otra herramienta
            </Button>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => {
              if (!tools.assignLoading) {
                setModals((prev) => ({ ...prev, showAssignToolModal: false }));
                setTools({
                  toAssign: [],
                  available: [],
                  search: "",
                  assignLoading: false,
                  alert: { msg: "", show: false, type: "error" },
                });

              }
            }}
            appearance="subtle"
            disabled={tools.assignLoading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleAssignTools}
            appearance="primary"
            loading={tools.assignLoading}
            disabled={tools.toAssign.length === 0 || tools.toAssign.some(t => !t.toolId)}
          >
            Asignar herramientas
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};