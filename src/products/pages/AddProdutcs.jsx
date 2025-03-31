"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import apiRequest from "../../helpers/ApiRequest"
import { Alert } from "../../ui"

export const AddProdutcs = () => {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    purchase_price: "",
    quantity: "",
    is_consumable: false,
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    // Convertir valores numéricos
    const productData = {
      ...formData,
      purchase_price: Number.parseFloat(formData.purchase_price),
      quantity: Number.parseInt(formData.quantity, 10),
    }

    try {
      const response = await apiRequest({
        method: "POST",
        path: "products",
        data: productData,
      })

      if (response.status === 201) {
        // Redirigir a la lista de productos
        navigate("/products")
      } else {
        setError(`Error al crear el producto: ${response.status}`)
      }
    } catch (error) {
      console.error("Error al crear producto:", error)
      setError("Error al conectar con el servidor")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    navigate("/products")
  }

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Agregar Nuevo Producto</h1>

      {error && <Alert type="error" message={error} className="mb-4" />}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del Producto</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Ej: Bolsa de Cemento 42.5 Kg"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            placeholder="Ej: Bolsa de cemento 42.5 Kg blanca"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">Precio de Compra</label>
            <input
              type="number"
              name="purchase_price"
              value={formData.purchase_price}
              onChange={handleChange}
              required
              step="0.01"
              min="0"
              placeholder="Ej: 29.5"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">Cantidad</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
              min="0"
              placeholder="Ej: 30"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="is_consumable"
            checked={formData.is_consumable}
            onChange={handleChange}
            id="is_consumable"
            className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="is_consumable" className="ml-3 text-sm font-medium text-gray-700">
            Es consumible
          </label>
        </div>

        <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200 mt-6">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-md transition duration-200"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm transition duration-200"
          >
            {isSubmitting ? "Guardando..." : "Guardar Producto"}
          </button>
        </div>
      </form>
    </div>
  )
}

