"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { toolsIssuedColumns } from "../../../confiTable"
import { Breadcrumb, Table, Alert } from "../../ui"
import { IssueToolsModal } from "./IssueToolsModal"
import { ReturnToolsModal } from "./ReturnToolsModal"
import { CloseShiftModal } from "./CloseShiftModal"
import apiRequest from "../../helpers/ApiRequest"

export const ToolsIssuedPage = () => {
  const navigate = useNavigate()
  const [toolsIssued, setToolsIssued] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showIssueModal, setShowIssueModal] = useState(false)
  const [showReturnModal, setShowReturnModal] = useState(false)
  const [showCloseShiftModal, setShowCloseShiftModal] = useState(false)
  const [selectedShift, setSelectedShift] = useState(null)
  const [employees, setEmployees] = useState([])
  const [shifts, setShifts] = useState([])

  // Obtener empleados y turnos
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Obtener empleados
        const employeesResponse = await apiRequest({
          method: "GET",
          path: "employees",
        })

        if (employeesResponse.status === 200) {
          setEmployees(employeesResponse.data || [])
        }

        // Obtener turnos
        const shiftsResponse = await apiRequest({
          method: "GET",
          path: "shifts",
        })

        if (shiftsResponse.status === 200) {
          // Asegurarse de que shiftsData sea un array
          let shiftsData = []

          if (Array.isArray(shiftsResponse.data)) {
            shiftsData = shiftsResponse.data
          } else if (shiftsResponse.data && typeof shiftsResponse.data === "object") {
            // Si es un objeto, intentar extraer el array de alguna propiedad común
            shiftsData =
              shiftsResponse.data.items ||
              shiftsResponse.data.shifts ||
              shiftsResponse.data.results ||
              shiftsResponse.data.data ||
              []
          }

          setShifts(shiftsData)

          // Procesar los datos de herramientas asignadas
          await processToolsIssuedData(shiftsData, employeesResponse.data || [])
        }
      } catch (error) {
        console.error("Error al obtener datos iniciales:", error)
        setError("Error al cargar datos iniciales")
      }
    }

    fetchInitialData()
  }, [])

  // Función para determinar el estado general de las herramientas
  const determineOverallStatus = (tools) => {
    if (!tools || tools.length === 0) return "Sin herramientas"

    // Verificar si hay herramientas con estado PARCIAL explícito
    const hasPartialStatus = tools.some((tool) => tool.status === "PARCIAL" || tool.status === "Parcial")

    if (hasPartialStatus) return "Parcial"

    const allReturned = tools.every((tool) => tool.returned && tool.returned === tool.issued)

    const someReturned = tools.some((tool) => tool.returned && tool.returned > 0 && tool.returned < tool.issued)

    if (allReturned) return "Devuelto"
    if (someReturned) return "Parcial"
    return "Pendiente"
  }

  // Procesar los datos de herramientas asignadas a partir de los turnos y empleados
  const processToolsIssuedData = async (shiftsData, employeesData) => {
    setIsLoading(true)

    try {
      const toolsIssuedData = []

      // Verificar que shiftsData sea un array
      if (!Array.isArray(shiftsData)) {
        console.error("shiftsData no es un array:", shiftsData)
        setToolsIssued([])
        setIsLoading(false)
        return
      }

      // Para cada turno, intentamos obtener las herramientas asignadas
      for (const shift of shiftsData) {
        const employeeId = shift.employee?.id
        if (!employeeId) continue

        try {
          const response = await apiRequest({
            method: "GET",
            path: `tools-issued/employee/${employeeId}/shift/${shift.id}`,
          })

          if (response.status === 200 && response.data.tools && response.data.tools.length > 0) {
            // Verificar si el turno está activo (no tiene check_out_time)
            const isActive = !shift.check_out_time

            // Determinar el estado general basado en las herramientas
            const overallStatus = determineOverallStatus(response.data.tools)

            // Crear un resumen de las herramientas para este turno
            const toolsSummary = {
              id: `${shift.id}-${employeeId}`, // ID único para la fila
              shift_id: shift.id,
              employee_id: employeeId,
              employee_name: response.data.employeeName || `${shift.employee.firstname} ${shift.employee.lastname}`,
              shift_info: shift.check_in_time,
              shift_end: shift.check_out_time,
              is_active: isActive,

              // Resumen de herramientas
              product_name:
                response.data.tools.length === 1
                  ? response.data.tools[0].product.name
                  : `${response.data.tools.length} herramientas asignadas`,

              product_description:
                response.data.tools.length === 1
                  ? response.data.tools[0].product.description
                  : response.data.tools
                      .map((t) => t.product.name)
                      .join(", ")
                      .substring(0, 50) +
                    (response.data.tools.map((t) => t.product.name).join(", ").length > 50 ? "..." : ""),

              // Totales
              quantity_issued: response.data.summary.totalIssued,
              quantity_returned: response.data.summary.totalReturned || 0,
              quantity_missing: response.data.summary.totalMissing || 0,

              // Estado general
              status: overallStatus,

              // Datos completos para usar en detalles
              full_data: response.data,
            }

            toolsIssuedData.push(toolsSummary)
          }
        } catch (error) {
          console.error(`Error al obtener herramientas para turno ${shift.id}:`, error)
        }
      }

      setToolsIssued(toolsIssuedData)
    } catch (error) {
      console.error("Error al procesar datos:", error)
      setError("Error al procesar datos de herramientas")
      setToolsIssued([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewDetails = (tool) => {
    navigate(`/tools-issued/details/${tool.employee_id}/${tool.shift_id}`)
  }

  const handleIssueTools = () => {
    setShowIssueModal(true)
  }

  const handleReturnTools = (tool) => {
    setSelectedShift(tool)
    setShowReturnModal(true)
  }

  const handleCloseShift = (tool) => {
    setSelectedShift(tool)
    setShowCloseShiftModal(true)
  }

  const handleModalClose = () => {
    setShowIssueModal(false)
    setShowReturnModal(false)
    setShowCloseShiftModal(false)
    setSelectedShift(null)
  }

  const handleToolsIssued = () => {
    // Recargar los datos después de emitir herramientas
    const fetchInitialData = async () => {
      try {
        // Obtener empleados
        const employeesResponse = await apiRequest({
          method: "GET",
          path: "employees",
        })

        // Obtener turnos
        const shiftsResponse = await apiRequest({
          method: "GET",
          path: "shifts",
        })

        if (shiftsResponse.status === 200 && employeesResponse.status === 200) {
          // Asegurarse de que shiftsData sea un array
          let shiftsData = []

          if (Array.isArray(shiftsResponse.data)) {
            shiftsData = shiftsResponse.data
          } else if (shiftsResponse.data && typeof shiftsResponse.data === "object") {
            // Si es un objeto, intentar extraer el array de alguna propiedad común
            shiftsData =
              shiftsResponse.data.items ||
              shiftsResponse.data.shifts ||
              shiftsResponse.data.results ||
              shiftsResponse.data.data ||
              []
          }

          setShifts(shiftsData)
          setEmployees(employeesResponse.data || [])

          // Procesar los datos de herramientas asignadas
          await processToolsIssuedData(shiftsData, employeesResponse.data || [])
        }
      } catch (error) {
        console.error("Error al obtener datos iniciales:", error)
      }
    }

    fetchInitialData()
    handleModalClose()
  }

  const handleToolsReturned = () => {
    // Recargar los datos después de devolver herramientas
    handleToolsIssued()
  }

  const handleShiftClosed = () => {
    // Recargar los datos después de cerrar un turno
    handleToolsIssued()
  }

  // Configuración de acciones para la tabla
  const toolsIssuedActions = [
    {
      label: "Ver Detalles",
      onClick: handleViewDetails,
    },
    {
      label: "Registrar Devolución",
      onClick: handleReturnTools,
      condition: (tool) => tool.status !== "Devuelto",
    },
    {
      label: "Cerrar Turno",
      onClick: handleCloseShift,
      condition: (tool) => tool.is_active === true,
    },
  ]

  return (
    <div className="p-6">
      <div className="mb-6">
        <Breadcrumb items={[{ label: "Herramientas Asignadas" }]} />
      </div>

      {error && <Alert type="error" message={error} className="mb-4" />}

      {isLoading ? (
        <div className="text-center py-8">Cargando herramientas asignadas...</div>
      ) : (
        <Table
          title="Herramientas Asignadas"
          columns={toolsIssuedColumns}
          actions={toolsIssuedActions}
          addButtonText="Nueva Asignación"
          onAddClick={handleIssueTools}
          data={toolsIssued || []}
        />
      )}

      {showIssueModal && <IssueToolsModal onClose={handleModalClose} onSuccess={handleToolsIssued} />}

      {showReturnModal && selectedShift && (
        <ReturnToolsModal
          shiftId={selectedShift.shift_id}
          employeeId={selectedShift.employee_id}
          employeeName={selectedShift.employee_name}
          onClose={handleModalClose}
          onSuccess={handleToolsReturned}
        />
      )}

      {showCloseShiftModal && selectedShift && (
        <CloseShiftModal
          shiftId={selectedShift.shift_id}
          employeeId={selectedShift.employee_id}
          employeeName={selectedShift.employee_name}
          onClose={handleModalClose}
          onSuccess={handleShiftClosed}
        />
      )}
    </div>
  )
}

