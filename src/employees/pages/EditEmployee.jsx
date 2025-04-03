"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import apiRequest from "../../helpers/ApiRequest"
import { Alert, Input, Button, Breadcrumb, Form, FormField } from "../../ui"

export const EditEmployee = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [employee, setEmployee] = useState({
    firstname: "",
    lastname: "",
    dui: "",
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchEmployee = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await apiRequest({
          method: "GET",
          path: `employees/${id}`,
        })

        if (response.status === 200) {
          setEmployee({
            firstname: response.data.firstname || "",
            lastname: response.data.lastname || "",
            dui: response.data.dui || "",
          })
        } else {
          setError(`Error al obtener el empleado. Código: ${response.status}`)
        }
      } catch (error) {
        console.error("Error al obtener el empleado:", error)
        setError("Error al conectar con el servidor")
      } finally {
        setIsLoading(false)
      }
    }

    fetchEmployee()
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setEmployee({
      ...employee,
      [name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await apiRequest({
        method: "PATCH",
        path: `employees/${id}`,
        data: employee,
      })

      if (response.status === 200) {
        navigate("/employees")
      } else {
        setError(`Error al actualizar el empleado. Código: ${response.status}`)
      }
    } catch (error) {
      console.error("Error al actualizar el empleado:", error)
      setError("Error al conectar con el servidor")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    navigate("/employees")
  }

  if (isLoading) {
    return <div className="p-6">Cargando información del empleado...</div>
  }

  // Configuración del Breadcrumb
  const breadcrumbItems = [{ label: "Empleados", href: "/employees" }, { label: "Editar empleado" }]

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      <h1 className="text-2xl font-bold mb-6">Editar Empleado</h1>

      {error && <Alert type="error" message={error} className="mb-4" />}

      <Form onSubmit={handleSubmit} submitText={isSubmitting ? "Guardando..." : "Guardar Cambios"}>
        <FormField>
          <Input
            label="Nombre"
            type="text"
            name="firstname"
            value={employee.firstname}
            onChange={handleChange}
            required
          />
        </FormField>

        <FormField>
          <Input
            label="Apellido"
            type="text"
            name="lastname"
            value={employee.lastname}
            onChange={handleChange}
            required
          />
        </FormField>

        <FormField>
          <Input label="DUI"  mask="########-#" type="text" name="dui" value={employee.dui} onChange={handleChange} required />
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
