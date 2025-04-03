"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import apiRequest from "../../helpers/ApiRequest"
import { Alert, Input, Button, Breadcrumb, Form, FormField } from "../../ui"

export const AddEmployee = () => {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    dui: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await apiRequest({
        method: "POST",
        path: "employees",
        data: formData,
      })

      if (response.status === 201) {
        // Redirigir a la lista de empleados
        navigate("/employees")
      } else {
        setError(`Error al crear el empleado: ${response.status}`)
      }
    } catch (error) {
      console.error("Error al crear empleado:", error)
      setError("Error al conectar con el servidor")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    navigate("/employees")
  }

  // Configuración del Breadcrumb
  const breadcrumbItems = [{ label: "Empleados", href: "/employees" }, { label: "Agregar empleado" }]

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      <h1 className="text-2xl font-bold mb-6">Agregar Nuevo Empleado</h1>

      {error && <Alert type="error" message={error} className="mb-4" />}

      <Form onSubmit={handleSubmit} submitText={isSubmitting ? "Guardando..." : "Guardar Empleado"}>
        <FormField>
          <Input
            label="Nombre"
            type="text"
            name="firstname"
            value={formData.firstname}
            onChange={handleChange}
            required
            placeholder="Ej: Juan Antonio"
          />
        </FormField>

        <FormField>
          <Input
            label="Apellido"
            type="text"
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
            required
            placeholder="Ej: Baiza Hernandez"
          />
        </FormField>

        <FormField>
          <Input
            label="DUI"
            type="text"
            name="dui"
            value={formData.dui}
            onChange={handleChange}
            required
            mask="########-#"
            placeholder="Ej: 00000000-0"
          />
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
