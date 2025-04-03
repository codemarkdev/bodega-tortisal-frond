"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import apiRequest from "../../helpers/ApiRequest"
import { Alert, Input, Button, Breadcrumb, Form, FormField } from "../../ui"

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

  // Configuración del Breadcrumb
  const breadcrumbItems = [{ label: "Productos", href: "/products" }, { label: "Agregar Producto" }]

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      {error && <Alert type="error" message={error} className="mb-4" />}

      <Form onSubmit={handleSubmit} title="Agregar Nuevo Producto" submitText="Guardar Producto">
        <FormField>
          <Input
            label="Nombre del Producto"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Ej: Bolsa de Cemento 42.5 Kg"
          />
        </FormField>

        <FormField>
          <Input
            label="Descripción"
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            placeholder="Ej: Bolsa de cemento 42.5 Kg blanca"
          />
        </FormField>

        <FormField>
          <Input
            label="Precio de Compra"
            type="number"
            name="purchase_price"
            value={formData.purchase_price}
            onChange={handleChange}
            required
            step="0.01"
            min="0"
            placeholder="Ej: 29.5"
          />
        </FormField>

        <FormField>
          <Input
            label="Cantidad"
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
            min="0"
            placeholder="Ej: 30"
          />
        </FormField>

        <FormField>
          <div className="flex items-center">
            <input
              type="checkbox"
              name="is_consumable"
              checked={formData.is_consumable}
              onChange={handleChange}
              id="is_consumable"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="is_consumable" className="ml-2 text-sm text-gray-700">
              Es consumible
            </label>
          </div>
        </FormField>

        <div className="flex justify-end space-x-3 mt-6">
          <Button variant="secondary" onClick={handleCancel} disabled={isSubmitting}>
            Cancelar
          </Button>
        </div>
      </Form>
    </div>
  )
}

