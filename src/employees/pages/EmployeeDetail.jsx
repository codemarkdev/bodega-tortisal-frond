"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import apiRequest from "../../helpers/ApiRequest"
import { Alert, Button, Breadcrumb } from "../../ui"

export const EmployeeDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [employee, setEmployee] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchEmployee = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await apiRequest({
          method: "GET",
          path: `employees/${id}`,
        })

        if (response.status === 200) {
          setEmployee(response.data)
        } else {
          setError(`Error al obtener el empleado. Código: ${response.status}`)
        }
      } catch (error) {
        console.error("Error al obtener el empleado:", error)
        setError("Error al conectar con el servidor")
      } finally {
        setIsLoading(false)
      }
    }

    fetchEmployee()
  }, [id])

  const handleBack = () => {
    navigate("/employees")
  }

  const handleEdit = () => {
    navigate(`/employees/edit/${id}`)
  }

  if (isLoading) {
    return <div className="p-6">Cargando información del empleado...</div>
  }

  if (!employee && !isLoading) {
    return (
      <div className="p-6">
        <Alert type="error" message="No se pudo encontrar el empleado" />
        <div className="mt-4">
          <Button variant="primary" onClick={handleBack}>
            Volver a Empleados
          </Button>
        </div>
      </div>
    )
  }

  // Configuración del Breadcrumb
  const breadcrumbItems = [{ label: "Empleados", href: "/employees" }, { label: "Detalle de empleado" }]

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Detalle del Empleado</h1>
          <div className="space-x-3">
            <Button variant="primary" onClick={handleEdit}>
              Editar
            </Button>
            <Button variant="secondary" onClick={handleBack}>
              Volver
            </Button>
          </div>
        </div>

        {error && <Alert type="error" message={error} className="mb-4" />}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold mb-2">Información Personal</h2>
            <div className="space-y-3">
              <div>
                <p className="text-gray-600">ID:</p>
                <p className="font-medium">{employee.id}</p>
              </div>
              <div>
                <p className="text-gray-600">Nombre:</p>
                <p className="font-medium">{employee.firstname}</p>
              </div>
              <div>
                <p className="text-gray-600">Apellido:</p>
                <p className="font-medium">{employee.lastname}</p>
              </div>
              <div>
                <p className="text-gray-600">DUI:</p>
                <p className="font-medium font-mono">{employee.dui}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
