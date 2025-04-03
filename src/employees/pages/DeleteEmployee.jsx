"use client"

import { useState } from "react"
import apiRequest from "../../helpers/ApiRequest"
import { Alert, Button } from "../../ui"

export const DeleteEmployee = ({ employeeId, employeeName, onCancel, onSuccess }) => {
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState(null)

  const handleDelete = async () => {
    setIsDeleting(true)
    setError(null)

    try {
      const response = await apiRequest({
        method: "DELETE",
        path: `employees/${employeeId}`,
      })

      if (response.status === 200 || response.status === 204) {
        onSuccess()
      } else {
        setError(`Error al eliminar el empleado. Código: ${response.status}`)
      }
    } catch (error) {
      console.error("Error al eliminar el empleado:", error)
      setError("Error al conectar con el servidor")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
        <h2 className="text-xl font-bold mb-4">Confirmar eliminación</h2>

        <p className="mb-6">
          ¿Está seguro que desea eliminar al empleado <span className="font-semibold">{employeeName}</span>? Esta acción
          no se puede deshacer.
        </p>

        {error && <Alert type="error" message={error} className="mb-4" />}

        <div className="flex justify-end space-x-3">
          <Button variant="secondary" onClick={onCancel} disabled={isDeleting}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? "Eliminando..." : "Eliminar"}
          </Button>
        </div>
      </div>
    </div>
  )
}

