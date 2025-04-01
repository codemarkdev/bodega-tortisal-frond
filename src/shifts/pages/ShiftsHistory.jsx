import { useParams } from "react-router-dom";
import { Breadcrumb, Table } from "../../ui";
import apiRequest from "../../helpers/ApiRequest";
import { columnsShifts } from "../../../confiTable";
import { useState, useEffect, useCallback } from "react";
import { Button, DateRangePicker, Panel } from 'rsuite';
export const ShiftsHistory = () => {
    const { id } = useParams();
    const [dateRange, setDateRange] = useState(null);
    const [historyEmployee, setHistoryEmployee] = useState({
        data: [],
        isLoading: false,
        error: null // Añadir manejo de errores
    });

    // Formatear fecha más eficiente
    const formatDate = useCallback((date) => {
        if (!date) return '';
        return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).replace(/\//g, '-');
    }, []);

    const getHistoryByEmployee = useCallback(async (id, startDate, endDate) => {
        setHistoryEmployee(prev => ({ ...prev, isLoading: true, error: null }));
        
        let path = `shifts/employee/${id}/history`;
        const params = new URLSearchParams();
        
        if (startDate) params.append('startDate', formatDate(startDate));
        if (endDate) params.append('endDate', formatDate(endDate));
        
        if (params.toString()) path += `?${params.toString()}`;

        try {
            const { data, status } = await apiRequest({
                method: 'GET',
                path: path
            });

            setHistoryEmployee({
                isLoading: false,
                data: status === 200 ? data : [],
                error: null
            });
        } catch (error) {
            setHistoryEmployee({ 
                isLoading: false, 
                data: [], 
                error: error.message || 'Error al cargar el historial' 
            });
        }
    }, [formatDate]);

    const handleDateRangeChange = (range) => {
        setDateRange(range);
    };

    const handleClearFilters = () => {
        setDateRange(null);
        getHistoryByEmployee(id);
    };

    useEffect(() => {
        getHistoryByEmployee(id, dateRange?.[0], dateRange?.[1]);
    }, [id, dateRange, getHistoryByEmployee]);

    // Obtener nombre del empleado para el título
    const employeeName = historyEmployee.data?.[0]?.employee 
        ? `${historyEmployee.data[0].employee.firstname} ${historyEmployee.data[0].employee.lastname}`
        : 'Empleado';

    return (
        <div className="shifts-history-container">
         <Breadcrumb  items={[{ label: "Turnos", href: "/users" }, { label: "Historial de turnos", href: '' }]} />
            
            <Panel 
                header={<h3 className="text-lg font-semibold">Filtros</h3>} 
                className="bg-white shadow-sm my-6" 
                bordered
                collapsible
            >
                <div className="flex items-center space-x-4">
                    <DateRangePicker
                        showOneCalendar
                        onChange={handleDateRangeChange}
                        value={dateRange}
                        placeholder="Selecciona un rango de fechas"
                        className="w-64"
                        format="dd-MM-yyyy"
                        cleanable={false}
                    />
                    
                    <Button 
                        appearance="ghost" 
                        onClick={handleClearFilters}
                        disabled={!dateRange}
                    >
                        Limpiar filtros
                    </Button>
                </div>
            </Panel>

            {historyEmployee.error && (
                <Message showIcon type="error" className="mb-4">
                    {historyEmployee.error}
                </Message>
            )}

            <Table
                title={`Historial de marcaciones - ${employeeName}`}
                data={historyEmployee.data}
                columns={columnsShifts}
                isLoading={historyEmployee.isLoading}
                itemsPerPage={10}
                paginationProps={{
                    showLengthMenu: true,
                    showInfo: true,
                    lengthMenu: [5, 10, 20, 50]
                }}
                emptyMessage={`No se encontraron registros para ${employeeName}`}
                className="shadow-sm"
                rowClassName={(rowData, index) => 
                    index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                }
            />
        </div>
    );
};