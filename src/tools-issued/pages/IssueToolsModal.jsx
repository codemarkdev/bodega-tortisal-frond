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
  const [isLoadingInitialData, setIsLoadingInitialData] = useState(true)
  const [currentShift, setCurrentShift] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingInitialData(true)
      try {
        console.log("Cargando datos iniciales...")

        // Obtener empleados
        const employeesResponse = await apiRequest({
          method: "GET",
          path: "employees/findAll",
        })

        // Obtener productos
        const productsResponse = await apiRequest({
          method: "GET",
          path: "products",
        })

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

      } catch (error) {
        console.error("Error al cargar datos:", error)
        setError("Error al cargar empleados o productos. Por favor, intente nuevamente.")
      } finally {
        setIsLoadingInitialData(false)
      }
    }

    fetchData()
  }, [])

  // Verificar el turno del empleado cuando cambia
  useEffect(() => {
    const checkEmployeeShift = async () => {
console.log('depurar: ', employeeId, )
      if (!employeeId) {
        setCurrentShift(null)
        return
      }
      console.log('depurar: ', )

      setIsLoading(true)
      try {
        const response = await apiRequest({
          method: "GET",
          path: `shifts/employee/${employeeId}/today`,
        })

        if (response.status === 200 && response.data) {
          setCurrentShift(response.data)
          
          // Si tiene check_out_time no null, mostrar error
          if (response.data.check_out_time !== null) {
            setError("Este empleado ya marcó su hora de salida. No se pueden asignar herramientas.")
          } else {
            setError(null)
          }
        } else {
          setCurrentShift(null)
          setError(null)
        }
      } catch (error) {
        console.error("Error al verificar turno:", error)
        setCurrentShift(null)
        setError("Error al verificar el turno del empleado")
      } finally {
        setIsLoading(false)
      }
    }

    checkEmployeeShift()
  }, [employeeId])

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (!employeeId) {
      setError("Por favor seleccione un empleado")
      setIsLoading(false)
      return
    }

    if (!currentShift || currentShift.check_out_time !== null) {
      setError("No se puede asignar herramientas. El empleado no tiene un turno activo.")
      setIsLoading(false)
      return
    }

    const invalidItems = selectedItems.filter((item) => !item.productId || item.quantity < 1)
    if (invalidItems.length > 0 || selectedItems.length === 0) {
      setError("Por favor seleccione productos y cantidades válidas")
      setIsLoading(false)
      return
    }

    const products = Object.values(
      selectedItems.reduce((acc, item) => {
        const productId = Number.parseInt(item.productId);
        const quantity = Number.parseInt(item.quantity);
        
        acc[productId] = {
          productId,
          quantity: (acc[productId]?.quantity || 0) + quantity
        };
        
        return acc;
      }, {})
    );
    try {
      console.log("Enviando datos de asignación:", {
        shiftId: currentShift.id,
        products,
      })

      const response = await apiRequest({
        method: "POST",
        path: `tools-issued/issue/${currentShift.id}`,
        data: {
          products
        },
      })



      if (response.status === 201 || response.status === 200) {
        onSuccess()
      } else {
        setError(`Error al registrar préstamo: ${response.data?.message}`)
      }
    } catch (error) {
      console.error("Error al registrar préstamo:", error)
      setError("Error al conectar con el servidor")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmployeeChange = (e) => {
    setEmployeeId(e.target.value)
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
                  disabled={isLoading}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado del Turno</label>
                {currentShift ? (
                  <div className={`p-2 border rounded-md ${
                    currentShift.check_out_time === null 
                      ? "bg-green-50 border-green-200 text-green-700" 
                      : "bg-red-50 border-red-200 text-red-700"
                  }`}>
                    <p className="text-sm">
                      {currentShift.check_out_time === null 
                        ? "Turno activo (no ha marcado salida)" 
                        : "Turno finalizado (ya marcó salida)"}
                    </p>
                    <p className="text-xs mt-1">
                      ID: {currentShift.id} | Entrada: {currentShift.check_in_time} | 
                      {currentShift.check_out_time && ` Salida: ${currentShift.check_out_time}`}
                    </p>
                  </div>
                ) : (
                  <div className="p-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-600">
                    No hay turno registrado hoy
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
                    disabled={!currentShift || currentShift.check_out_time !== null}
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
                    disabled={!currentShift || currentShift.check_out_time !== null}
                  />
                </div>

                <div className="flex items-end">
                  {selectedItems.length > 1 && (
                    <Button 
                      type="button" 
                      variant="danger" 
                      onClick={() => handleRemoveItem(index)} 
                      className="mt-auto"
                      disabled={!currentShift || currentShift.check_out_time !== null}
                    >
                      Eliminar
                    </Button>
                  )}
                </div>
              </div>
            ))}

            <div className="mb-6">
              <Button 
                type="button" 
                variant="secondary" 
                onClick={handleAddItem}
                disabled={!currentShift || currentShift.check_out_time !== null}
              >
                + Agregar Producto
              </Button>
            </div>

            <div className="flex justify-end space-x-3">
              <Button variant="secondary" onClick={onClose} disabled={isLoading}>
                Cancelar
              </Button>
              <Button 
                type="submit" 
                variant="primary" 
                disabled={isLoading || !currentShift || currentShift.check_out_time !== null}
              >
                {isLoading ? "Guardando..." : "Guardar Asignación"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}