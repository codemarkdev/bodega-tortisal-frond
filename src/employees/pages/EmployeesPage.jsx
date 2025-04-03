"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { columnsEmployees } from "../../../confiTable"
import { Edit, Table, Trash } from "../../ui"
import apiRequest from "../../helpers/ApiRequest"
import { FloatingAlert } from "../../ui/components/FlotingAlert"

export const EmployeesPage = () => {
  const navigate = useNavigate()
  const [employees, setEmployees] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [alert, setAlert] = useState({
    show: false,
    type: 'error',
    msg: ''
  })
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });

  const restAlert = () => {
    setAlert({
      show: false,
      msg: '',
      error: 'error'
    })
  }

  const fetchEmployees = async (page = 1) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await apiRequest({
        method: "GET",
        path: `employees?page=${page}&limit=${pagination.itemsPerPage}`,
      })

      if (response.status === 200) {
        const data = response.data


        setEmployees(data.data);
        setPagination((prev) => ({
          ...prev,
          totalItems: data.total || 0,
          currentPage: page,
        }));

      } else {
        setEmployees([])
        setError(`Error al obtener empleados. Código: ${response.status}`)
      }
    } catch (error) {
      console.error("Error al realizar la petición:", error)
      setEmployees([])
      setError("Error al conectar con el servidor")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchEmployees()
  }, [])

  const handleEdit = (id) => {
    navigate(`/employees/edit/${id}`)
  }

  const handleDelete = async (employee) => {
    const { status, data } = await apiRequest({
      path: `employees/${employee.id}`,
      method: 'DELETE'
    })
    if (status === 200) {
      setAlert(
       {
        show: true,
        msg:'Eliminadas correctamente',
        type: "success"
       }
      )
      fetchEmployees()
    }
    else {
      setAlert(
        {
         show: true,
         msg:'Ya esta relacionado con turno',
         type: "error"
        }
       )

    }

  }



  const handleAddEmployee = () => {
    navigate("/employees/create")
  }

  const handlePageChange = (page) => {
    fetchEmployees(page);
  };

  // Configuración de acciones para la tabla
  const actions = [
    {
      icon: Edit,
      label: "Editar",
      onClick: (employee) => handleEdit(employee.id),
    },
    {
      icon: Trash,
      label: "Eliminar",
      onClick: (employee) => handleDelete(employee),
    },
  ]

  return (
    <div className="p-6">
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      {isLoading ? (
        <div className="text-center py-8">Cargando empleados...</div>
      ) : (
        
        <Table
          title="Empleados"
          columns={columnsEmployees}
          actions={actions}
          addButtonText="Agregar Empleado"
          onAddClick={handleAddEmployee}
          data={employees || []}
          paginationProps={{
            itemsPerPage: pagination.itemsPerPage,
            totalItems: pagination.totalItems,
            currentPage: pagination.currentPage,
            onPageChange: handlePageChange,
          }}
        />
      )}
      {alert.show && (
          <FloatingAlert 
            position="top-center"
            message={alert.msg}  
            type={alert.type} 
            onClose={() => {
              setAlert(prev => ({
                show: false,
                msg: '',
                type: 'error'
                
              }));
            }}
            duration={3000}
          />)}


    </div>
  )
}
