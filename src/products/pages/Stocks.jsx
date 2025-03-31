"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import apiRequest from "../../helpers/ApiRequest"
import { Alert, Input, Button, Breadcrumb, FormField } from "../../ui"

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
          <Button variant="primary" onClick={handleCancel}>
            Volver a Productos
          </Button>
        </div>
      </div>
    )
  }

  // Configuración del Breadcrumb
  const breadcrumbItems = [{ label: "Productos", href: "/products" }, { label: "Gestión de Stock" }]

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <Breadcrumb items={breadcrumbItems} />
      </div>

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
            <FormField>
              <Input
                label="Cantidad a Aumentar"
                type="number"
                value={increaseQuantity}
                onChange={(e) => setIncreaseQuantity(e.target.value)}
                min="1"
                placeholder="Ingrese cantidad"
              />
            </FormField>
            <Button type="submit" variant="primary" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Procesando..." : "Aumentar Stock"}
            </Button>
          </form>
        </div>

        {/* Formulario para disminuir stock */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Disminuir Stock</h2>
          <form onSubmit={handleDecreaseStock}>
            <FormField>
              <Input
                label="Cantidad a Disminuir"
                type="number"
                value={decreaseQuantity}
                onChange={(e) => setDecreaseQuantity(e.target.value)}
                min="1"
                max={product ? product.quantity : 0}
                placeholder="Ingrese cantidad"
              />
            </FormField>
            <Button
              type="submit"
              variant="danger"
              disabled={isSubmitting || (product && product.quantity <= 0)}
              className="w-full"
            >
              {isSubmitting ? "Procesando..." : "Disminuir Stock"}
            </Button>
          </form>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <Button variant="secondary" onClick={handleCancel}>
          Volver a Productos
        </Button>
      </div>
    </div>
  )
}

