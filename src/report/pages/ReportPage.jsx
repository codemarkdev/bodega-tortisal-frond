import React, { useEffect, useState } from 'react';
import { Card, Panel, Button, SelectPicker } from 'rsuite';
import apiRequest from '../../helpers/ApiRequest';
import { Shift, History,  Table } from '../../ui';
import { columsMissing } from '../../../confiTable';


export const ReportPage = () => {
  const [datosReporte, setDatosReporte] = useState(null);
  const [employee, setEmployee] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null); // New state for selected employee
  const [missingProduct, setmissingProduct] = useState({
    isloading: false, 
    data: []
  });
  
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [ultimaActualizacion, setUltimaActualizacion] = useState(new Date());


  const obtenerDatosReporte = async () => {
    try {
      setCargando(true);
      setError(null);
      const { data } = await apiRequest({
        method: 'GET',
        path: 'missing-products/stats'
      });
      setDatosReporte(data);
      setUltimaActualizacion(new Date(data.lastUpdated));
    } catch (error) {
      console.error('Error al obtener los datos del reporte:', error);
      setError('No se pudo cargar el reporte. Inténtalo de nuevo.');
    } finally {
      setCargando(false);
    }
  };
  const getEmployee = async() => {
   const {status, data} = await apiRequest({
    method: "GET",
    path: 'employees/findAll'
   })
   if(status == 200){
    setEmployee(data)
    console.log('data',data.data)
   }
   else {
    setEmployee([])
   }
  }

  const getMissingProduct = async (employeeId = null, dateRange = null) => {
    setmissingProduct((prev) => ({
      ...prev,
      isloading: true
    }));

    let path = 'missing-products';
    console.log('emp', employeeId)
    if (employeeId) {
      path = `missing-products/employee/${employeeId}`;
    }

    const { data, status } = await apiRequest({
      method: 'GET',
      path,
    });

    if (status === 200) {
      setmissingProduct({
        data: data,
        isloading: false
      });
    } else {
      setmissingProduct({
        data: [],
        isloading: false
      });
    }
  };

  useEffect(() => {
    getEmployee(); 
    getMissingProduct(); 
    obtenerDatosReporte();
  }, []);

  const applyFilters = () => {
    const employeeId = selectedEmployee; // Directly use selectedEmployee as it holds the value
    getMissingProduct(employeeId); 
  };

  const formatearMoneda = (valor) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(valor);
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return 'N/A';
    return new Date(fecha).toLocaleString();
  };

  if (cargando && !datosReporte) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
          <p className="text-gray-600">Cargando datos del reporte...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-8 p-4 bg-red-50 border border-red-200 rounded-lg text-center">
        <div className="text-red-500 mb-3">
          <Shift className="inline-block" />
        </div>
        <p className="text-red-700 mb-4">{error}</p>
        <button
          onClick={obtenerDatosReporte}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center justify-center mx-auto"
          disabled={cargando}
        >
          {cargando ? (
            <span className="animate-spin inline-block mr-2">
              <Shift className="w-4 h-4" />
            </span>
          ) : (
            <span className="mr-2">
              <History className="w-4 h-4" />
            </span>
          )}
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-2xl font-bold text-gray-800">Panel de Reporte de Herramientas Faltantes</h3>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            Última actualización: <span className="font-medium">{formatearFecha(ultimaActualizacion)}</span>
          </span>
          <button
            onClick={obtenerDatosReporte}
            className="p-2 bg-blue-500 text-white rounded-full shadow hover:bg-blue-600 transition duration-200"
            disabled={cargando}
          >
            {cargando ? (
              <span className="animate-spin inline-block">
                <Shift className="w-5 h-5" />
              </span>
            ) : (
              <History className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="shadow-lg px-8 py-6 bg-white rounded-lg hover:shadow-xl transition duration-200">
          <h4 className="text-lg font-semibold text-gray-800">Herramienta más faltante</h4>
          <p className="text-sm text-gray-500 mt-2">
            {datosReporte?.mostMissingProduct?.product?.name || 'N/A'}
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Total faltante: <span className="font-medium">{datosReporte?.mostMissingProduct?.totalMissing || 0}</span>
          </p>
        </Card>

        <Card className="shadow-lg px-8 py-6 bg-white rounded-lg hover:shadow-xl transition duration-200">
          <h4 className="text-lg font-semibold text-gray-800">Empleado con más herramientas faltantes</h4>
          <p className="text-sm text-gray-500 mt-2">
            {datosReporte?.worstEmployee?.employee?.name  || 'N/A'}
          </p>
       
        </Card>

        <Card className="shadow-lg px-8 py-6 bg-white rounded-lg hover:shadow-xl transition duration-200">
          <h4 className="text-lg font-semibold text-gray-800">Total general de herramientas faltantes</h4>
          <p className="text-sm text-gray-600 mt-2">
            {formatearMoneda(datosReporte?.totalLoss?.totalLoss || 0)}
          </p>
        </Card>
      </div>

      <Panel
        header={<h3 className="text-lg font-semibold text-gray-800">Filtrar por empleado</h3>}
      collapsible
        bordered
        className="mt-8 bg-white shadow-lg rounded-lg"
      >
        <div className="flex items-center space-x-6">
          <SelectPicker
            data={employee.map((item) => ({ label: `${item?.firstname} ${item?.lastname}`, value: item.id }))}
            placeholder="Selecciona un empleado para filtrar"
            onChange={(value) => setSelectedEmployee(value)}
            style={{ width: 300 }}
            loading={employee.length === 0}
            className="border border-gray-300 rounded-lg shadow-sm"
          />

          <Button
            appearance="primary"
            onClick={applyFilters}
            loading={missingProduct.isloading}
            className="bg-blue-500 text-white hover:bg-blue-600 transition duration-200"
          >
            Aplicar filtro
          </Button>
        </div>
      </Panel>

      {missingProduct.data.length === 0 && !missingProduct.isloading ? (
        <div className="text-center text-gray-500 mt-6">
          No hay datos disponibles para mostrar.
        </div>
      ) : (
        <div className="mt-6 bg-white shadow-lg rounded-lg p-4">
          <Table
            data={missingProduct.data}
            columns={columsMissing}
            className="rounded-lg overflow-hidden"
          />
        </div>
      )}
    </div>
  );
};
