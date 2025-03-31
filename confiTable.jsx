import React from 'react';

const columnsUser = [
  {
    key: 'id',
    title: 'ID',
    width: '80px'
  },
  {
    key: 'username',
    title: 'Nombre de Usuario',
    render: (item) => (
      <span className="font-medium">{item.username}</span>
    )
  },
  // {
  //   key: 'email',
  //   title: 'Correo Electrónico',
  //   render: (item) => (
  //     <a href={`mailto:${item.email}`} className="text-blue-600 hover:underline">
  //       {item.email}
  //     </a>
  //   )
  // },
  {
    key: 'role',
    title: 'Rol',
    render: (item) => {
      const roleColors = {
        'admin': 'bg-purple-100 text-purple-800',
        'Gerente': 'bg-blue-100 text-blue-800',
        'Desarrollador Senior': 'bg-green-100 text-green-800',
        'Desarrollador': 'bg-teal-100 text-teal-800',
        'Diseñador UX/UI': 'bg-pink-100 text-pink-800',
        'default': 'bg-gray-100 text-gray-800'
      };

      const colorClass = roleColors[item.role] || roleColors.default;

      return (
        <span className={`px-2 py-1 text-xs rounded-full ${colorClass}`}>
          {item.role}
        </span>
      );
    }
  },
  // {
  //   key: 'createdAt',
  //   title: 'Fecha de Creación',
  //   render: (item) => new Date(item.createdAt).toLocaleDateString()
  // }
];


const columnsEmployees = [
  { key: 'id', title: 'ID' },
  { key: 'first_name', title: 'Nombre' },
  { key: 'last_name', title: 'Apellido' },
  {
    key: 'did',
    title: 'DUI',
    render: (item) => (
      <span className="font-mono">{item.did}</span>
    )
  }
];



const toolsIssuedColumns = [
  { 
    key: "id", 
    title: "ID", 
    width: 80 
  },
  { 
    key: "shift_info", 
    title: "Turno (Fecha - Empleado)", 
    width: 200 
  },
  { 
    key: "product_name", 
    title: "Herramienta", 
    width: 180 
  },
  { 
    key: "product_description", 
    title: "Descripción", 
    width: 250 
  },
  { 
    key: "quantity_issued", 
    title: "Cant. Entregada", 
    width: 120,
    render: (item) => <span className="font-medium">{item.quantity_issued}</span>
  },
  { 
    key: "quantity_returned", 
    title: "Cant. Devuelta", 
    width: 120,
    render: (item) => <span className="font-medium">{item.quantity_returned}</span>
  },
  { 
    key: "status", 
    title: "Estado", 
    width: 120,
    render: (item) => (
      <span className={`px-2 py-1 rounded-full text-xs ${
        item.status === "Devuelto" 
          ? "bg-green-100 text-green-800" 
          : "bg-yellow-100 text-yellow-800"
      }`}>
        {item.status}
      </span>
    )
  }
];

const columsInventario = [
  { key: 'id', title: 'ID' },
  { key: 'name', title: 'Producto' },
  { key: 'purchase_price', title: 'Precio' },
  { key: 'quantity', title: 'cantidad' },
  {
    key: 'is_consumable',
    title: 'Consumibles',
    render: (item) => (
      <span className={`font-mono ${item.is_consumable ? 'text-green-500': 'text-red-500'}`}>
        {item.is_consumable ? 'Sí': 'No'}
      </span>
    )
  }
];


export {columnsEmployees, columnsUser, toolsIssuedColumns, columsInventario };