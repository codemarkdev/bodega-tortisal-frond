"use client"

import { useState, useEffect } from "react"
import { Alert, Button, Input, FormField } from "../../ui"
import apiRequest from "../../helpers/ApiRequest"

export const IssueToolsModal = ({ onClose, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [employees, setEmployees] = useState([])
  const [products, setProducts] = useState([])
  const [selectedItems, setSelectedItems] = useState([{ productId: "", quantity: 1 }])
  const [employeeId, setEmployeeId] = useState("")
  const [isCreatingShift, setIsCreatingShift] = useState(false)
  const [shiftCreated, setShiftCreated] = useState(null)
  const [employeeShifts, setEmployeeShifts] = useState({})
  const [isLoadingInitialData, setIsLoadingInitialData] = useState(true)

  // Cargar empleados y productos al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingInitialData(true)
      try {
        console.log("Cargando datos iniciales...")

        // Obtener empleados
        const employeesResponse = await apiRequest({
          method: "GET",
          path: "employees",
        })

        console.log("Respuesta de empleados:", employeesResponse)

        // Obtener productos
        const productsResponse = await apiRequest({
          method: "GET",
          path: "products",
        })

        console.log("Respuesta de productos:", productsResponse)

        // Procesar empleados
        if (employeesResponse.status === 200) {
          let employeesData = []

          if (Array.isArray(employeesResponse.data)) {
            employeesData = employeesResponse.data
          } else if (employeesResponse.data && typeof employeesResponse.data === "object") {
            employeesData =
              employeesResponse.data.items ||
              employeesResponse.data.employees ||
              employeesResponse.data.results ||
              employeesResponse.data.data ||
              []
          }

          console.log("Empleados procesados:", employeesData)
          setEmployees(employeesData)
        } else {
          console.error("Error al obtener empleados:", employeesResponse.status)
          setError(`Error al cargar empleados: ${employeesResponse.status}`)
        }

        // Procesar productos
        if (productsResponse.status === 200) {
          let productsData = []

          if (Array.isArray(productsResponse.data)) {
            productsData = productsResponse.data
          } else if (productsResponse.data && typeof productsResponse.data === "object") {
            productsData =
              productsResponse.data.items ||
              productsResponse.data.products ||
              productsResponse.data.results ||
              productsResponse.data.data ||
              []
          }

          console.log("Productos procesados:", productsData)
          setProducts(productsData)
        } else {
          console.error("Error al obtener productos:", productsResponse.status)
          setError(`Error al cargar productos: ${productsResponse.status}`)
        }

        // Obtener todos los turnos para verificar límites por empleado
        const shiftsResponse = await apiRequest({
          method: "GET",
          path: "shifts",
        })

        if (shiftsResponse.status === 200) {
          // Procesar los turnos por empleado
          let shiftsData = []

          if (Array.isArray(shiftsResponse.data)) {
            shiftsData = shiftsResponse.data
          } else if (shiftsResponse.data && typeof shiftsResponse.data === "object") {
            shiftsData =
              shiftsResponse.data.items ||
              shiftsResponse.data.shifts ||
              shiftsResponse.data.results ||
              shiftsResponse.data.data ||
              []
          }

          const shiftsMap = {}

          // Agrupar turnos por empleado y fecha
          shiftsData.forEach((shift) => {
            if (shift.employee && shift.employee.id) {
              const employeeId = shift.employee.id
              const shiftDate = shift.check_in_time.split(" ")[0] // Obtener solo la fecha (formato: DD-MM-YYYY)

              if (!shiftsMap[employeeId]) {
                shiftsMap[employeeId] = {}
              }

              if (!shiftsMap[employeeId][shiftDate]) {
                shiftsMap[employeeId][shiftDate] = []
              }

              shiftsMap[employeeId][shiftDate].push(shift)
            }
          })

          setEmployeeShifts(shiftsMap)
        }
      } catch (error) {
        console.error("Error al cargar datos:", error)
        setError("Error al cargar empleados o productos. Por favor, intente nuevamente.")
      } finally {
        setIsLoadingInitialData(false)
      }
    }

    fetchData()
  }, [])

  const handleAddItem = () => {
    setSelectedItems([...selectedItems, { productId: "", quantity: 1 }])
  }

  const handleRemoveItem = (index) => {
    const newItems = [...selectedItems]
    newItems.splice(index, 1)
    setSelectedItems(newItems)
  }

  const handleItemChange = (index, field, value) => {
    const newItems = [...selectedItems]
    newItems[index] = { ...newItems[index], [field]: value }
    setSelectedItems(newItems)
  }

  const checkEmployeeShiftLimit = (employeeId) => {
    // Verificar si el empleado ya tiene un turno hoy
    if (!employeeId || !employeeShifts[employeeId]) {
      return true // No tiene turnos registrados
    }

    const today = new Date()
    const dd = String(today.getDate()).padStart(2, "0")
    const mm = String(today.getMonth() + 1).padStart(2, "0") // Enero es 0
    const yyyy = today.getFullYear()

    const todayFormatted = `${dd}-${mm}-${yyyy}`

    return !employeeShifts[employeeId][todayFormatted] || employeeShifts[employeeId][todayFormatted].length === 0
  }

  const handleCreateShift = async () => {
    if (!employeeId) {
      setError("Por favor seleccione un empleado primero")
      return
    }

    // Verificar si el empleado ya tiene un turno hoy
    if (!checkEmployeeShiftLimit(employeeId)) {
      setError("Este empleado ya tiene un turno creado para hoy. Solo se permite un turno por día por empleado.")
      return
    }

    setIsCreatingShift(true)
    setError(null)

    try {
      console.log("Creando turno para empleado:", employeeId)

      const response = await apiRequest({
        method: "POST",
        path: "shifts",
        data: {
          id_employee: Number.parseInt(employeeId),
        },
      })

      console.log("Respuesta de creación de turno:", response)

      if (response.status === 201) {
        setShiftCreated(response.data)

        // Actualizar el registro de turnos del empleado
        const newShift = response.data
        const shiftDate = newShift.check_in_time.split(" ")[0]

        setEmployeeShifts((prev) => {
          const updated = { ...prev }
          if (!updated[employeeId]) {
            updated[employeeId] = {}
          }
          if (!updated[employeeId][shiftDate]) {
            updated[employeeId][shiftDate] = []
          }
          updated[employeeId][shiftDate].push(newShift)
          return updated
        })
      } else {
        setError(`Error al crear turno: ${response.status}`)
      }
    } catch (error) {
      console.error("Error al crear turno:", error)

      // Verificar si es un error 404 (posiblemente por límite de turno)
      if (error.response && error.response.status === 404) {
        setError("No se puede crear más de un turno por día para este empleado.")
      } else {
        setError("Error al conectar con el servidor")
      }
    } finally {
      setIsCreatingShift(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    // Validaciones
    if (!shiftCreated) {
      setError("Por favor cree un turno primero")
      setIsLoading(false)
      return
    }

    if (!employeeId) {
      setError("Por favor seleccione un empleado")
      setIsLoading(false)
      return
    }

    const invalidItems = selectedItems.filter((item) => !item.productId || item.quantity < 1)
    if (invalidItems.length > 0 || selectedItems.length === 0) {
      setError("Por favor seleccione productos y cantidades válidas")
      setIsLoading(false)
      return
    }

    // Preparar datos para enviar
    const products = selectedItems.map((item) => ({
      productId: Number.parseInt(item.productId),
      quantity: Number.parseInt(item.quantity),
    }))

    try {
      console.log("Enviando datos de asignación:", {
        shiftId: shiftCreated.id,
        products,
      })

      const response = await apiRequest({
        method: "POST",
        path: `tools-issued/issue/${shiftCreated.id}`,
        data: {
          products,
        },
      })

      console.log("Respuesta de asignación:", response)

      if (response.status === 201 || response.status === 200) {
        onSuccess()
      } else {
        setError(`Error al registrar préstamo: ${response.status}`)
      }
    } catch (error) {
      console.error("Error al registrar préstamo:", error)
      setError("Error al conectar con el servidor")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmployeeChange = (e) => {
    const newEmployeeId = e.target.value
    setEmployeeId(newEmployeeId)

    // Si el empleado ya tiene un turno hoy, mostrar advertencia
    if (newEmployeeId && !checkEmployeeShiftLimit(newEmployeeId)) {
      setError("Este empleado ya tiene un turno creado para hoy. Solo se permite un turno por día por empleado.")
    } else {
      setError(null)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Nueva Asignación de Herramientas</h2>

        {error && <Alert type="error" message={error} className="mb-4" />}

        {isLoadingInitialData ? (
          <div className="text-center py-8">
            <p className="mb-4">Cargando datos...</p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <FormField>
                <label className="block text-sm font-medium text-gray-700 mb-1">Empleado</label>
                <select
                  value={employeeId}
                  onChange={handleEmployeeChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={isCreatingShift || shiftCreated}
                >
                  <option value="">Seleccione un empleado</option>
                  {employees.length > 0 ? (
                    employees.map((employee) => (
                      <option key={employee.id} value={employee.id}>
                        {employee.firstname} {employee.lastname}
                      </option>
                    ))
                  ) : (
                    <option disabled>No hay empleados disponibles</option>
                  )}
                </select>
                {employees.length === 0 && !isLoadingInitialData && (
                  <p className="text-sm text-red-500 mt-1">No se pudieron cargar los empleados</p>
                )}
              </FormField>

              <FormField>
                <label className="block text-sm font-medium text-gray-700 mb-1">Turno</label>
                {!shiftCreated ? (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleCreateShift}
                    disabled={!employeeId || isCreatingShift || (employeeId && !checkEmployeeShiftLimit(employeeId))}
                    className="w-full"
                  >
                    {isCreatingShift ? "Creando turno..." : "Crear nuevo turno"}
                  </Button>
                ) : (
                  <div className="p-2 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-sm text-green-700">
                      Turno creado con ID: <span className="font-medium">{shiftCreated.id}</span>
                    </p>
                    <p className="text-xs text-green-600 mt-1">Fecha: {shiftCreated.check_in_time}</p>
                  </div>
                )}
              </FormField>
            </div>

            <h3 className="text-lg font-semibold mb-3">Herramientas a Asignar</h3>

            {selectedItems.map((item, index) => (
              <div key={index} className="flex flex-col md:flex-row gap-3 mb-4 p-3 border border-gray-200 rounded-md">
                <div className="flex-grow">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Producto</label>
                  <select
                    value={item.productId}
                    onChange={(e) => handleItemChange(index, "productId", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Seleccione un producto</option>
                    {products.length > 0 ? (
                      products.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name} - {product.description}
                        </option>
                      ))
                    ) : (
                      <option disabled>No hay productos disponibles</option>
                    )}
                  </select>
                  {products.length === 0 && !isLoadingInitialData && (
                    <p className="text-sm text-red-500 mt-1">No se pudieron cargar los productos</p>
                  )}
                </div>

                <div className="w-full md:w-32">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad</label>
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                    min="1"
                    required
                  />
                </div>

                <div className="flex items-end">
                  {selectedItems.length > 1 && (
                    <Button type="button" variant="danger" onClick={() => handleRemoveItem(index)} className="mt-auto">
                      Eliminar
                    </Button>
                  )}
                </div>
              </div>
            ))}

            <div className="mb-6">
              <Button type="button" variant="secondary" onClick={handleAddItem}>
                + Agregar Producto
              </Button>
            </div>

            <div className="flex justify-end space-x-3">
              <Button variant="secondary" onClick={onClose} disabled={isLoading}>
                Cancelar
              </Button>
              <Button type="submit" variant="primary" disabled={isLoading || !shiftCreated}>
                {isLoading ? "Guardando..." : "Guardar Asignación"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

