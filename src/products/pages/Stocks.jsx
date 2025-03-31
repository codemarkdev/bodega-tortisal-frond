"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import apiRequest from "../../helpers/ApiRequest"
import { Alert } from "../../ui"

export const Stocks = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [increaseQuantity, setIncreaseQuantity] = useState("")
  const [decreaseQuantity, setDecreaseQuantity] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState(null)

  // Obtener información del producto
  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await apiRequest({
          method: "GET",
          path: `products/${id}`,
        })

        if (response.status === 200) {
          setProduct(response.data)
        } else {
          setError(`Error al obtener el producto. Código: ${response.status}`)
        }
      } catch (error) {
        console.error("Error al obtener el producto:", error)
        setError("Error al conectar con el servidor")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  // Función para actualizar el stock (aumentar o disminuir)
  const updateStock = async (action, quantity) => {
    if (!quantity || Number.parseInt(quantity) <= 0) {
      setError(`Por favor ingrese una cantidad válida para ${action === "increase" ? "aumentar" : "disminuir"}`)
      return
    }

    if (action === "decrease" && product && Number.parseInt(quantity) > product.quantity) {
      setError("No puede disminuir más de lo que hay en stock")
      return
    }

    setIsSubmitting(true)
    setError(null)
    setSuccessMessage(null)

    try {
      const response = await apiRequest({
        method: "PATCH",
        path: `products/${id}/${action}?quantity=${quantity}`,
      })

      if (response.status === 200) {
        setProduct(response.data)
        setSuccessMessage(
          `Stock ${action === "increase" ? "aumentado" : "disminuido"} exitosamente. Nuevo stock: ${response.data.quantity}`,
        )

        // Limpiar el campo correspondiente
        if (action === "increase") {
          setIncreaseQuantity("")
        } else {
          setDecreaseQuantity("")
        }
      } else {
        setError(`Error al ${action === "increase" ? "aumentar" : "disminuir"} el stock. Código: ${response.status}`)
      }
    } catch (error) {
      console.error(`Error al ${action === "increase" ? "aumentar" : "disminuir"} el stock:`, error)
      setError("Error al conectar con el servidor")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Manejadores de eventos
  const handleIncreaseStock = (e) => {
    e.preventDefault()
    updateStock("increase", increaseQuantity)
  }

  const handleDecreaseStock = (e) => {
    e.preventDefault()
    updateStock("decrease", decreaseQuantity)
  }

  const handleCancel = () => {
    navigate("/products")
  }

  if (isLoading) {
    return <div className="p-6">Cargando información del producto...</div>
  }

  if (!product && !isLoading) {
    return (
      <div className="p-6">
        <Alert type="error" message="No se pudo encontrar el producto" />
        <div className="mt-4">
          <button onClick={handleCancel} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md">
            Volver a Productos
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Gestión de Stock</h1>

      {/* Información del producto */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Información del Producto</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">ID:</p>
            <p className="font-medium">{product.id}</p>
          </div>
          <div>
            <p className="text-gray-600">Nombre:</p>
            <p className="font-medium">{product.name}</p>
          </div>
          <div>
            <p className="text-gray-600">Descripción:</p>
            <p className="font-medium">{product.description}</p>
          </div>
          <div>
            <p className="text-gray-600">Stock Actual:</p>
            <p className="font-medium text-lg">{product.quantity}</p>
          </div>
        </div>
      </div>

      {/* Mensajes de éxito o error */}
      {successMessage && <Alert type="success" message={successMessage} className="mb-4" />}

      {error && <Alert type="error" message={error} className="mb-4" />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Formulario para aumentar stock */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Aumentar Stock</h2>
          <form onSubmit={handleIncreaseStock}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Cantidad a Aumentar</label>
              <input
                type="number"
                value={increaseQuantity}
                onChange={(e) => setIncreaseQuantity(e.target.value)}
                min="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ingrese cantidad"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition duration-200"
            >
              {isSubmitting ? "Procesando..." : "Aumentar Stock"}
            </button>
          </form>
        </div>

        {/* Formulario para disminuir stock */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Disminuir Stock</h2>
          <form onSubmit={handleDecreaseStock}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Cantidad a Disminuir</label>
              <input
                type="number"
                value={decreaseQuantity}
                onChange={(e) => setDecreaseQuantity(e.target.value)}
                min="1"
                max={product ? product.quantity : 0}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ingrese cantidad"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting || (product && product.quantity <= 0)}
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition duration-200"
            >
              {isSubmitting ? "Procesando..." : "Disminuir Stock"}
            </button>
          </form>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={handleCancel}
          className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-md transition duration-200"
        >
          Volver a Productos
        </button>
      </div>
    </div>
  )
}

