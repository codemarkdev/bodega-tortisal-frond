import { Table } from "../../ui";

const employeesData = [
    {
      id: 1,
      first_name: 'María',
      last_name: 'García',
      did: '12345678-9'
    },
    {
      id: 2,
      first_name: 'Juan',
      last_name: 'Pérez',
      did: '98765432-1'
    },
    {
      id: 3,
      first_name: 'Ana',
      last_name: 'Martínez',
      did: '45678912-3'
    },
    {
      id: 4,
      first_name: 'Carlos',
      last_name: 'Rodríguez',
      did: '32165498-7'
    },
    {
      id: 5,
      first_name: 'Sofía',
      last_name: 'López',
      did: '78912345-6'
    },
    {
      id: 6,
      first_name: 'Luis',
      last_name: 'Hernández',
      did: '65498732-1'
    },
    {
      id: 7,
      first_name: 'Elena',
      last_name: 'Gómez',
      did: '23456789-0'
    },
    {
      id: 8,
      first_name: 'Pedro',
      last_name: 'Sánchez',
      did: '87654321-9'
    },
    {
      id: 9,
      first_name: 'Isabel',
      last_name: 'Díaz',
      did: '34567891-2'
    },
    {
      id: 10,
      first_name: 'Jorge',
      last_name: 'Fernández',
      did: '91234567-8'
    }
  ];
export const EmployeesPage = () => {

    const columns = [
        { key: 'id', title: 'ID' },
        { key: 'first_name', title: 'Nombre' },
        { key: 'last_name', title: 'Apellido' },
        { key: 'did', title: 'DUI' }
      ];
      const actions = [
        {
          label: 'Editar',
          onClick: (employee) => console.log('Editar empleado:', employee)
        },
        {
          label: 'Eliminar',
          className: 'text-red-600 hover:text-red-900',
          onClick: (employee) => console.log('Eliminar empleado:', employee)
        }
      ];
      return(

        <div className="flex flex-col px-2 py-4">


            <Table
            title="Lista de Empleados"
            columns={columns}
            data={employeesData}
            actions={actions}
            onAddClick={() => console.log('Agregar nuevo empleado')}
            addButtonText="Nuevo Empleado"
            itemsPerPage={5} 
          />
        </div>
      )
    
}