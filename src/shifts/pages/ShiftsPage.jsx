import { useState, useEffect } from "react";
import { columnsShifts } from "../../../confiTable";
import { Breadcrumb, Calendar, Edit, History, Shift, Table, Trash } from "../../ui";
import apiRequest from "../../helpers/ApiRequest";
import { useNavigate } from "react-router-dom";
import { FloatingAlert } from "../../ui/components/FlotingAlert";
import { DatePicker, Button, Panel, Message } from 'rsuite';


export const ShiftsPage = () => {
  const [listShifts, setListShifts] = useState({
    data: [],
    dataPage: [],
    isLoading: false,
    alert: {
      msg: "",
      show: false,
      type: "error"
    },
    selectedDate: null
  });
  
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });

  const navigate = useNavigate();
  
  const formatDate = (date) => {
    if (!date) return '';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const getShifts = async (date = null, page = 1) => {
    setListShifts(prev => ({
      ...prev, 
      isLoading: true
    }));
    
    let path = `shifts?page=${page}&limit=${pagination.itemsPerPage}`;
    if (date) {
      path += `&date=${formatDate(date)}`;
    }
    
    try {
      const {status, data} = await apiRequest({
        method: 'GET', 
        path: path
      });
      
      if (status === 200) {
        setListShifts(prev => ({
          ...prev,
          data: data.data ?? [],
          dataPage: data ?? [],
          isLoading: false,
          alert: {
            ...prev.alert,
            show: false
          }
        }));
        setPagination(prev => ({
          ...prev,
          totalItems: data.total ?? 0,
          currentPage: page
        }));
      } else {
        setListShifts(prev => ({
          ...prev,
          isLoading: false,
          alert: {
            msg: data?.message || "Error al obtener los turnos",
            show: true,
            type: 'error'
          }
        }));
      }
    } catch (error) {
      setListShifts(prev => ({
        ...prev,
        isLoading: false,
        alert: {
          msg: "Error de conexión",
          show: true,
          type: 'error'
        }
      }));
    }
  };
  
  useEffect(() => {
    getShifts();
  }, []);

  const handleDateChange = (date) => {
    setListShifts(prev => ({
      ...prev,
      selectedDate: date
    }));
    getShifts(date);
  };

  const handleClearDate = () => {
    setListShifts(prev => ({
      ...prev,
      selectedDate: null
    }));
    getShifts();
  };

  const handleCheckOutTime = async(id) => {
    setListShifts(prev => ({
      ...prev,
      isLoading: true
    }));
    
    try {
      const {status, data} = await apiRequest({
        method: 'POST',
        path: `shifts/employee/${id}/close`
      });
      
      if(status === 201){
        setListShifts(prev => ({
          ...prev,
          alert: {
            msg: "Registrada correctamente",
            show: true,
            type: 'success'
          }
        }));
        await getShifts(listShifts.selectedDate);
      } else {
        setListShifts(prev => ({
          ...prev,
          alert: {
            msg: `${data?.message ? data?.message : "Error al registrar"}`,
            show: true,
            type: 'error'
          }
        }));
      }
    } catch (error) {
      setListShifts(prev => ({
        ...prev,
        alert: {
          msg: "Error de conexión",
          show: true,
          type: 'error'
        }
      }));
    } finally {
      setListShifts(prev => ({
        ...prev,
        isLoading: false
      }));
    }
  };

  const handleDelete = async (shift) => {
    setListShifts(prev => ({
      ...prev,
      isLoading: true
    }));
    
    try {
      const { status } = await apiRequest({
        method: 'DELETE',
        path: `shifts/${shift.id}`
      });
      
      if (status === 200) {
        setListShifts(prev => ({
          ...prev,
          alert: {
            msg: "Turno eliminado correctamente",
            show: true,
            type: 'success'
          }
        }));
        await getShifts(listShifts.selectedDate);
      }
    } catch (error) {
      setListShifts(prev => ({
        ...prev,
        alert: {
          msg: "Error al eliminar el turno",
          show: true,
          type: 'error'
        }
      }));
    } finally {
      setListShifts(prev => ({
        ...prev,
        isLoading: false
      }));
    }
  };

  const handlePageChange = (page) => {
    getShifts(listShifts.selectedDate, page);
  };

  const actions = [
    {
      icon: Trash,
      label: 'Eliminar',
      onClick: (shift) => handleDelete(shift),
      disabled: listShifts.isLoading,
  
    }, 
    {
      icon: Calendar,
      label: 'Cerrar turno',
      onClick: (shift) => handleCheckOutTime(shift.employee.id),
      disabled: listShifts.isLoading
    },
    {
      icon: History,
      label: 'Historial',
      onClick: (shift) => navigate(`/shifts/${shift.employee.id}`)
    },
  ];
    
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
    </div>
  );
};