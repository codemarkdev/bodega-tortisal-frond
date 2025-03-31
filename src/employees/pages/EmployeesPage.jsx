"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { columnsEmployees } from "../../../confiTable"
import { Edit, Table, Trash } from "../../ui"
import apiRequest from "../../helpers/ApiRequest"
import { DeleteEmployee } from "./DeleteEmployee"

export const EmployeesPage = () => {
  const navigate = useNavigate()
  const [employees, setEmployees] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [employeeToDelete, setEmployeeToDelete] = useState(null)

  const fetchEmployees = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await apiRequest({
        method: "GET",
        path: "employees?page=1&limit=10",
      })

      if (response.status === 200) {
        const data = response.data

        // Procesamiento de datos para asegurar que tenemos un array
        if (Array.isArray(data)) {
          setEmployees(data)
        } else if (data && typeof data === "object") {
          const employeesArray = data.items || data.employees || data.results || data.data || []
          setEmployees(Array.isArray(employeesArray) ? employeesArray : [])
        } else {
          setEmployees([])
        }
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

  const handleDelete = (employee) => {
    setEmployeeToDelete(employee)
  }

  const handleCancelDelete = () => {
    setEmployeeToDelete(null)
  }

  const handleSuccessDelete = () => {
    fetchEmployees()
    setEmployeeToDelete(null)
  }

  const handleAddEmployee = () => {
    navigate("/employees/create")
  }

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
        />
      )}

      {employeeToDelete && (
        <DeleteEmployee
          employeeId={employeeToDelete.id}
          employeeName={`${employeeToDelete.firstname} ${employeeToDelete.lastname}`}
          onCancel={handleCancelDelete}
          onSuccess={handleSuccessDelete}
        />
      )}
    </div>
  )
}
