"use client"

import { useState, useEffect } from "react"
import { Alert, Button, Input, FormField } from "../../ui"
import apiRequest from "../../helpers/ApiRequest"

export const ReturnToolsModal = ({ shiftId, employeeId, employeeName, onClose, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isFetchingTools, setIsFetchingTools] = useState(true)
  const [error, setError] = useState(null)
  const [toolsData, setToolsData] = useState(null)
  const [returnItems, setReturnItems] = useState([])

  // Cargar herramientas asignadas al empleado en el turno
  useEffect(() => {
    const fetchTools = async () => {
      setIsFetchingTools(true)
      setError(null)

      try {
        const response = await apiRequest({
          method: "GET",
          path: `tools-issued/employee/${employeeId}/shift/${shiftId}`,
        })

        if (response.status === 200) {
          setToolsData(response.data)

          // Inicializar los items a devolver
          const initialReturnItems = response.data.tools
            .filter((tool) => {
              // Incluir herramientas pendientes o parcialmente devueltas
              return (
                tool.status === "PENDIENTE" ||
                tool.status === "Pendiente" ||
                tool.status === "PARCIAL" ||
                tool.status === "Parcial" ||
                tool.issued > (tool.returned || 0)
              )
            })
            .map((tool) => ({
              productId: tool.product.id,
              productName: tool.product.name,
              issued: tool.issued,
              returned: tool.returned || 0,
              quantityReturned: 0,
              maxReturn: tool.issued - (tool.returned || 0),
              status: tool.status,
            }))

          setReturnItems(initialReturnItems)
        } else {
          setError(`Error al obtener herramientas: ${response.status}`)
        }
      } catch (error) {
        console.error("Error al obtener herramientas:", error)
        setError("Error al conectar con el servidor")
      } finally {
        setIsFetchingTools(false)
      }
    }

    fetchTools()
  }, [shiftId, employeeId])

  const handleQuantityChange = (index, value) => {
    const newValue = Number.parseInt(value) || 0
    const newReturnItems = [...returnItems]

    // Asegurar que no se devuelva más de lo prestado
    const maxReturn = newReturnItems[index].maxReturn
    newReturnItems[index].quantityReturned = Math.min(newValue, maxReturn)

    setReturnItems(newReturnItems)
  }

  // Modificar la función handleSubmit para incluir información sobre herramientas faltantes
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    // Validar que al menos un item tenga cantidad mayor a cero
    const hasItemsToReturn = returnItems.some((item) => item.quantityReturned > 0)
    if (!hasItemsToReturn) {
      setError("Debe ingresar al menos una cantidad a devolver")
      setIsLoading(false)
      return
    }

    // Preparar datos para enviar
    const toolsToReturn = returnItems
      .filter((item) => item.quantityReturned > 0)
      .map((tool) => ({
        productId: tool.productId,
        quantityReturned: tool.quantityReturned,
        // Indicar si la devolución es parcial (para que el backend calcule correctamente los faltantes)
        status: tool.quantityReturned < tool.maxReturn ? "PARCIAL" : "DEVUELTO",
      }))

    try {
      const response = await apiRequest({
        method: "POST",
        path: `tools-issued/return/${shiftId}`,
        data: {
          tools: toolsToReturn,
          // Incluir un indicador para que el backend sepa que debe calcular faltantes
          calculateMissing: true,
        },
      })

      if (response.status === 200 || response.status === 201) {
        onSuccess()
      } else {
        setError(`Error al registrar devolución: ${response.status}`)
      }
    } catch (error) {
      console.error("Error al registrar devolución:", error)
      setError("Error al conectar con el servidor")
    } finally {
      setIsLoading(false)
    }
  }

  // Función para determinar el estado de devolución
  const getReturnStatus = (item) => {
    if (item.returned === 0) {
      return "PENDIENTE"
    } else if (item.returned < item.issued) {
      return "PARCIAL"
    } else {
      return "DEVUELTO"
    }
  }

  // Función para obtener la clase CSS según el estado
  const getStatusClass = (status) => {
    const normalizedStatus = status?.toUpperCase()
    switch (normalizedStatus) {
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Registrar Devolución de Herramientas</h2>

        {error && <Alert type="error" message={error} className="mb-4" />}

        <div className="mb-6 bg-gray-50 p-4 rounded-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">ID de Turno:</p>
              <p className="font-medium">{shiftId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Empleado:</p>
              <p className="font-medium">{employeeName}</p>
            </div>
          </div>
        </div>

        {isFetchingTools ? (
          <div className="text-center py-8">Cargando herramientas asignadas...</div>
        ) : returnItems.length === 0 ? (
          <Alert type="info" message="No hay herramientas pendientes de devolución para este turno" className="mb-4" />
        ) : (
          <form onSubmit={handleSubmit}>
            <h3 className="text-lg font-semibold mb-3">Herramientas a Devolver</h3>

            {returnItems.map((item, index) => {
              const currentStatus = item.status || getReturnStatus(item)
              const statusClass = getStatusClass(currentStatus)

              return (
                <div key={index} className="mb-4 p-4 border border-gray-200 rounded-md">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-sm text-gray-600">Producto:</p>
                      <p className="font-medium">{item.productName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Cantidad Prestada:</p>
                      <p className="font-medium">{item.issued}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Ya Devuelto:</p>
                      <p className="font-medium">{item.returned}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Estado:</p>
                      <p className="font-medium">
                        <span className={`px-2 py-1 text-xs rounded-full ${statusClass}`}>{currentStatus}</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Pendiente:</p>
                      <p className="font-medium">{item.maxReturn}</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <FormField>
                      <Input
                        label="Cantidad a Devolver"
                        type="number"
                        value={item.quantityReturned || 0}
                        onChange={(e) => handleQuantityChange(index, e.target.value)}
                        min="0"
                        max={item.maxReturn}
                        required={false}
                      />
                    </FormField>
                  </div>
                </div>
              )
            })}

            <div className="flex justify-end space-x-3 mt-6">
              <Button variant="secondary" onClick={onClose} disabled={isLoading}>
                Cancelar
              </Button>
              <Button type="submit" variant="primary" disabled={isLoading}>
                {isLoading ? "Guardando..." : "Registrar Devolución"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

