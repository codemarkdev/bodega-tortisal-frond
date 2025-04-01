"use client"

import { useState, useEffect } from "react"
import { Alert, Button } from "../../ui"
import apiRequest from "../../helpers/ApiRequest"

export const CloseShiftModal = ({ employeeId, employeeName, shiftId, onClose, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckingStatus, setIsCheckingStatus] = useState(true)
  const [error, setError] = useState(null)
  const [isShiftAlreadyClosed, setIsShiftAlreadyClosed] = useState(false)

  // Verificar si el turno ya está cerrado al cargar el componente
  useEffect(() => {
    const checkShiftStatus = async () => {
      setIsCheckingStatus(true)
      try {
        // Obtener información del turno
        const response = await apiRequest({
          method: "GET",
          path: `shifts/${shiftId}`,
        })

        if (response.status === 200) {
          // Si el turno tiene check_out_time, ya está cerrado
          if (response.data && response.data.check_out_time) {
            setIsShiftAlreadyClosed(true)
            setError("Este turno ya ha sido cerrado anteriormente.")
          }
        }
      } catch (error) {
        console.error("Error al verificar estado del turno:", error)
      } finally {
        setIsCheckingStatus(false)
      }
    }

    checkShiftStatus()
  }, [shiftId])

  const handleCloseShift = async () => {
    // Si ya verificamos que el turno está cerrado, no intentamos cerrarlo de nuevo
    if (isShiftAlreadyClosed) {
      setError("Este turno ya ha sido cerrado anteriormente.")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      console.log(`Cerrando turno para empleado ${employeeId}`)

      const response = await apiRequest({
        method: "POST",
        path: `shifts/employee/${employeeId}/close`,
      })

      console.log("Respuesta de cierre de turno:", response)

      if (response.status === 200 || response.status === 201) {
        onSuccess()
      } else {
        setError(`Error al cerrar el turno: ${response.status}`)
      }
    } catch (error) {
      console.error("Error al cerrar el turno:", error)

      // Manejar específicamente el error 400 (turno ya cerrado)
      if (error.response && error.response.status === 400) {
        setError("Este turno ya ha sido cerrado anteriormente.")
        setIsShiftAlreadyClosed(true)
      } else {
        setError("Error al conectar con el servidor")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
        <h2 className="text-xl font-bold mb-4">Cerrar Turno</h2>

        {error && <Alert type="error" message={error} className="mb-4" />}

        <div className="mb-6 bg-gray-50 p-4 rounded-md">
          <div className="space-y-2">
            <div>
              <p className="text-sm text-gray-600">Empleado:</p>
              <p className="font-medium">{employeeName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">ID de Turno:</p>
              <p className="font-medium">{shiftId}</p>
            </div>
          </div>
        </div>

        {isCheckingStatus ? (
          <div className="text-center py-4">
            <p className="mb-2">Verificando estado del turno...</p>
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
          </div>
        ) : isShiftAlreadyClosed ? (
          <div className="mb-6">
            <Alert
              type="warning"
              message="Este turno ya ha sido cerrado anteriormente. No es necesario cerrarlo de nuevo."
            />
          </div>
        ) : (
          <p className="mb-6">
            ¿Está seguro que desea cerrar el turno actual de este empleado? Esta acción registrará la hora de salida y
            no se podrá deshacer.
          </p>
        )}

        <div className="flex justify-end space-x-3">
          <Button variant="secondary" onClick={onClose} disabled={isLoading || isCheckingStatus}>
            Cancelar
          </Button>
          {!isShiftAlreadyClosed && !isCheckingStatus && (
            <Button variant="primary" onClick={handleCloseShift} disabled={isLoading || isCheckingStatus}>
              {isLoading ? "Cerrando turno..." : "Cerrar Turno"}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

