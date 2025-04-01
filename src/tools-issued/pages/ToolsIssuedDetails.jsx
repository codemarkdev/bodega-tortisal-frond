"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Alert, Button, Breadcrumb } from "../../ui"
import apiRequest from "../../helpers/ApiRequest"

export const ToolsIssuedDetails = () => {
  const { employeeId, shiftId } = useParams()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [toolsData, setToolsData] = useState(null)

  useEffect(() => {
    const fetchToolsDetails = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await apiRequest({
          method: "GET",
          path: `tools-issued/employee/${employeeId}/shift/${shiftId}`,
        })

        if (response.status === 200) {
          setToolsData(response.data)
        } else {
          setError(`Error al obtener detalles. Código: ${response.status}`)
        }
      } catch (error) {
        console.error("Error al obtener detalles:", error)
        setError("Error al conectar con el servidor")
      } finally {
        setIsLoading(false)
      }
    }

    fetchToolsDetails()
  }, [employeeId, shiftId])

  const handleBack = () => {
    navigate("/tools-issued")
  }

  const handleRegisterReturn = () => {
    navigate(`/tools-issued/return/${shiftId}/${employeeId}`)
  }

  // Modificar la función para determinar el estado de devolución
  const getReturnStatus = (tool) => {
    // Si no hay información de devolución, usar el estado proporcionado por el backend
    if (tool.status) {
      return tool.status
    }

    // Si no hay devoluciones registradas
    if (!tool.returned || tool.returned === 0) {
      return "PENDIENTE"
    }
    // Si hay devoluciones parciales
    else if (tool.returned < tool.issued) {
      return "PARCIAL"
    }
    // Si todas las herramientas fueron devueltas
    else {
      return "DEVUELTO"
    }
  }

  // Función para obtener la clase CSS según el estado
  const getStatusClass = (status) => {
    switch (status) {
      case "PENDIENTE":
        return "bg-yellow-100 text-yellow-800"
      case "PARCIAL":
        return "bg-blue-100 text-blue-800"
      case "DEVUELTO":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (isLoading) {
    return <div className="p-6">Cargando detalles...</div>
  }

  if (!toolsData && !isLoading) {
    return (
      <div className="p-6">
        <Alert type="error" message="No se pudieron encontrar los detalles solicitados" />
        <div className="mt-4">
          <Button variant="primary" onClick={handleBack}>
            Volver a Herramientas Asignadas
          </Button>
        </div>
      </div>
    )
  }

  // Configuración del Breadcrumb
  const breadcrumbItems = [
    { label: "Herramientas Asignadas", href: "/tools-issued" },
    { label: "Detalles de Asignación" },
  ]

  const canRegisterReturn = toolsData?.summary?.pending > 0

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Detalles de Herramientas Asignadas</h1>
          <div className="space-x-3">
            {canRegisterReturn && (
              <Button variant="primary" onClick={handleRegisterReturn}>
                Registrar Devolución
              </Button>
            )}
            <Button variant="secondary" onClick={handleBack}>
              Volver
            </Button>
          </div>
        </div>

        {error && <Alert type="error" message={error} className="mb-4" />}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h2 className="text-lg font-semibold mb-3">Información del Empleado y Turno</h2>
            <div className="space-y-3">
              <div>
                <p className="text-gray-600">Empleado:</p>
                <p className="font-medium">{toolsData.employeeName}</p>
              </div>
              <div>
                <p className="text-gray-600">ID de Turno:</p>
                <p className="font-medium">{toolsData.shiftId}</p>
              </div>
              <div>
                <p className="text-gray-600">Inicio de Turno:</p>
                <p className="font-medium">{toolsData.shiftStart}</p>
              </div>
              <div>
                <p className="text-gray-600">Fin de Turno:</p>
                <p className="font-medium">{toolsData.shiftEnd || "En curso"}</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-3">Resumen</h2>
            <div className="space-y-3">
              <div>
                <p className="text-gray-600">Total de Herramientas:</p>
                <p className="font-medium">{toolsData.summary.totalTools}</p>
              </div>
              <div>
                <p className="text-gray-600">Total Entregado:</p>
                <p className="font-medium">{toolsData.summary.totalIssued}</p>
              </div>
              <div>
                <p className="text-gray-600">Total Devuelto:</p>
                <p className="font-medium">{toolsData.summary.totalReturned}</p>
              </div>
              <div>
                <p className="text-gray-600">Total Faltante:</p>
                <p className="font-medium">{toolsData.summary.totalMissing}</p>
              </div>
              <div>
                <p className="text-gray-600">Pendientes:</p>
                <p className="font-medium font-bold">{toolsData.summary.pending}</p>
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-lg font-semibold mb-3">Herramientas Asignadas</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Producto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descripción
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Entregado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Devuelto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Faltante
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {toolsData?.tools?.map((tool) => {
                // Determinar el estado de la herramienta
                const status = tool.status || getReturnStatus(tool)
                const statusClass = getStatusClass(status)

                // Calcular faltantes si no vienen del backend
                const missing =
                  tool.missing !== undefined
                    ? tool.missing
                    : status === "PARCIAL"
                      ? tool.issued - (tool.returned || 0)
                      : 0

                return (
                  <tr key={tool.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{tool.product.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-500">{tool.product.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-900">{tool.issued}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-900">{tool.returned || 0}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-900 font-medium">{missing}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}`}
                      >
                        {status}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

