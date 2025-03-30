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
        'Administrador': 'bg-purple-100 text-purple-800',
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
  {
    key: 'createdAt',
    title: 'Fecha de Creación',
    render: (item) => new Date(item.createdAt).toLocaleDateString()
  }
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




export {columnsEmployees, columnsUser}