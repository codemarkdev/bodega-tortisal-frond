import React from 'react';

const columnsShifts = [
  { 
    key: "id", 
    title: "ID", 
    width: 80 
  },
  { 
    key: "employee", 
    title: "Empleado", 
    width: 200,
    render: (item) => (
      <span>
        {item.employee.firstname} {item.employee.lastname}
      </span>
    )
  },
  { 
    key: "check_in_time", 
    title: "Hora de entrada", 
    render: (item) => (
      <span className="font-mono text-xs px-2 py-1">{item.check_in_time}</span>
    )
  },
  { 
    key: "check_out_time", 
    title: "Hora de salida", 
    render: (item) => (
      <span className="font-mono text-xs px-2 py-1">{item.check_out_time}</span>
    )
  }

]




const columnsUser = [
  {
    key: "id",
    title: "ID",
    width: "80px",
  },
  {
    key: "username",
    title: "Nombre de Usuario",
    render: (item) => <span className="font-medium">{item.username}</span>,
  },
  {
    key: "role",
    title: "Rol",
    render: (item) => {
      const roleColors = {
        admin: "bg-purple-100 text-purple-800",
        Gerente: "bg-blue-100 text-blue-800",
        "Desarrollador Senior": "bg-green-100 text-green-800",
        Desarrollador: "bg-teal-100 text-teal-800",
        "Diseñador UX/UI": "bg-pink-100 text-pink-800",
        default: "bg-gray-100 text-gray-800",
      }

      const colorClass = roleColors[item.role] || roleColors.default

      return <span className={`px-2 py-1 text-xs rounded-full ${colorClass}`}>{item.role}</span>
    },
  },
]

// Actualizar las columnas de empleados con los nombres de campos correctos
const columnsEmployees = [
  { key: "id", title: "ID" },
  { key: "firstname", title: "Nombre" },
  { key: "lastname", title: "Apellido" },
  {
    key: "dui",
    title: "DUI",
    render: (item) => <span className="font-mono">{item.dui}</span>,
  },
]

const toolsIssuedColumns = [

  {
    key: "shift_info",
    title: "Turno (Fecha)",
    width: 150,
  },
  {
    key: "employee_name",
    title: "Empleado",
    width: 150,
  },
  {
    key: "product_name",
    title: "Herramienta",
    width: 180,
  },
  {
    key: "product_description",
    title: "Descripción",
    width: 250,
  },
  {
    key: "quantity_issued",
    title: "Cant. Entregada",
    width: 120,
    render: (item) => <span className="font-medium">{item.quantity_issued}</span>,
  },
  {
    key: "quantity_returned",
    title: "Cant. Devuelta",
    width: 120,
    render: (item) => <span className="font-medium">{item.quantity_returned}</span>,
  },
  {
    key: "quantity_missing",
    title: "Cant. Faltante",
    width: 120,
    render: (item) => (
      <span className={`font-medium ${item.quantity_missing > 0 ? "text-red-600 font-bold" : ""}`}>
        {item.quantity_missing || 0}
      </span>
    ),
  },
  {
    key: "status",
    title: "Estado",
    width: 120,
    render: (item) => {
      let colorClass = "bg-yellow-100 text-yellow-800" // Default para Pendiente

      if (item.status === "Devuelto" || item.status === "DEVUELTO") {
        colorClass = "bg-green-100 text-green-800"
      } else if (item.status === "Parcial" || item.status === "PARCIAL") {
        colorClass = "bg-blue-100 text-blue-800"
      }

      return <span className={`px-2 py-1 rounded-full text-xs ${colorClass}`}>{item.status}</span>
    },
  },
  {
    key: "shift_end",
    title: "Fin de Turno",
    width: 150,
    render: (item) => (
      <span>
        {item.shift_end ? (
          <span className="text-green-600">{item.shift_end}</span>
        ) : (
          <span className="text-yellow-600 text-xs font-medium px-2 py-1 bg-yellow-50 rounded-full">En curso</span>
        )}
      </span>
    ),
  },
]

const columsInventario = [
  { key: "id", title: "ID" },
  { key: "name", title: "Producto" },
  { key: "purchase_price", title: "Precio" },
  { key: "quantity", title: "cantidad" },
  {
    key: "is_consumable",
    title: "Consumibles",
    render: (item) => (
      <span className={`font-mono ${item.is_consumable ? "text-green-500" : "text-red-500"}`}>
        {item.is_consumable ? "Sí" : "No"}
      </span>
    ),
  },
]

export { columnsEmployees, columnsUser, toolsIssuedColumns, columsInventario,columnsShifts  }

