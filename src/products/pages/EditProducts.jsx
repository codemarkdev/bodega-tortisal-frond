"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import apiRequest from "../../helpers/ApiRequest"
import { Alert, Input, Button, Breadcrumb, Form, FormField } from "../../ui"

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

  // Configuración del Breadcrumb
  const breadcrumbItems = [{ label: "Productos", href: "/products" }, { label: "Editar producto" }]

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      {error && <Alert message={error} type="error" className="mb-4" />}

      <Form onSubmit={handleSubmit} title="Editar producto" submitText="Guardar Cambios">
        <FormField>
          <Input
            label="Nombre del producto"
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
            required
          />
        </FormField>

        <FormField>
          <Input
            label="Descripción"
            type="text"
            name="description"
            value={product.description}
            onChange={handleChange}
            required
          />
        </FormField>

        <FormField>
          <Input
            label="Precio de compra"
            type="number"
            name="purchase_price"
            value={product.purchase_price}
            onChange={handleChange}
            required
            step="0.01"
            min="0"
          />
        </FormField>

        <FormField>
          <Input
            label="Cantidad"
            type="number"
            name="quantity"
            value={product.quantity}
            onChange={handleChange}
            required
            min="0"
          />
        </FormField>

        <FormField>
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

