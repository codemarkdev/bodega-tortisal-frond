"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import apiRequest from "../../helpers/ApiRequest"
import { Alert } from "../../ui"

export const EditProducts = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState({
    name: "",
    description: "",
    purchase_price: "",
    quantity: "",
    is_consumable: false,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

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
          setProduct({
            name: response.data.name || "",
            description: response.data.description || "",
            purchase_price: response.data.purchase_price || "",
            quantity: response.data.quantity || "",
            is_consumable: response.data.is_consumable || false,
          })
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setProduct({
      ...product,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    // Convertir valores numéricos
    const productData = {
      ...product,
      purchase_price: Number.parseFloat(product.purchase_price),
      quantity: Number.parseInt(product.quantity, 10),
    }

    try {
      const response = await apiRequest({
        method: "PATCH",
        path: `products/${id}`,
        data: productData,
      })

      if (response.status === 200) {
        navigate("/products")
      } else {
        setError(`Error al actualizar el producto. Código: ${response.status}`)
      }
    } catch (error) {
      console.error("Error al actualizar el producto:", error)
      setError("Error al conectar con el servidor")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    navigate("/products")
  }

  if (isLoading) {
    return <div className="p-6">Cargando información del producto...</div>
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <a href="/products" className="text-blue-600 hover:text-blue-800">
                Productos
              </a>
            </li>
            <li>
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <span className="text-gray-500">Editar producto</span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      {error && <Alert type="error" message={error} className="mb-4" />}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del producto</label>
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
          <input
            type="text"
            name="description"
            value={product.description}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Precio de compra</label>
          <input
            type="number"
            name="purchase_price"
            value={product.purchase_price}
            onChange={handleChange}
            required
            step="0.01"
            min="0"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Cantidad</label>
          <input
            type="number"
            name="quantity"
            value={product.quantity}
            onChange={handleChange}
            required
            min="0"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="is_consumable"
            checked={product.is_consumable}
            onChange={handleChange}
            id="is_consumable"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="is_consumable" className="ml-2 text-sm text-gray-700">
            Es consumible
          </label>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-md transition duration-200"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm transition duration-200"
          >
            Guardar Cambios
          </button>
        </div>

        {/* Eliminamos el botón duplicado que aparecía aquí */}
      </form>
    </div>
  )
}

